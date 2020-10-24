import csv2geojson, { csv } from "csv2geojson";
import * as _ from "underscore";
import StatesBoundaries from "./StateBoundaries.json";
import CountyBoundaries from "./CountyBoundaries.json";

//This function downloads the CSV File data, adds it to GEOJSON file, and then Filters it for the US State Subsect,
export const get_states_data = async (url: string) => {
  const statesData = await fetch(url)
    .then((response) => {
      return response.text();
    })
    .then((response) => {
      if (!!response) {
        csv2geojson.csv2geojson(response, function (err, data) {
          var us_subsect = filter_us_data(data);
          var calc_total = calc_totals(us_subsect);
          var combined_data = combine_files(calc_total);
          // console.log(combined_data);
        });
      }
    });
  return statesData;
};

export const get_counties_data = async function (url) {
  const countyData = await fetch(url)
    .then((response) => {
      return response.text();
    })
    .then((response) => {
      if (!!response) {
        csv2geojson.csv2geojson(response, function (err, data) {
          var us_only_counties = filter_counties(data);
          var calc_county_totals = county_totals(us_only_counties);
          var combined_data = combined_county(calc_county_totals);
          // console.log(combined_data);
        });
      }
    });
  return countyData;
};

// Data for 2-week
export const get_time_series = async function (url) {
  const timeSeries = await fetch(url)
    .then((response) => {
      return response.text();
    })
    .then((response) => {
      return csv(response);
    });
  return timeSeries;
};

//County Level Data
var filter_us_county_data = function (data) {
  //filter our GUAM, VIRGIN ISLANDS
  // console.log(data);
  var not_in = ["66", "78"];
  if (not_in.indexOf(data.properties.FIPS) >= 0) {
    // console.log(data);
    return null;
  } else {
    return data;
  }
};
var filter_counties = function (data) {
  var z = _.each(data.features, function (feature) {
    // console.log(feature.properties);
    return filter_us_county_data(feature);
  });
  return z;
};
var county_totals = function (data) {
  var county_confirmed_totals = _.reduce(
    data,
    function (memo, item) {
      // console.log(item);
      memo[item.properties.FIPS] =
        (memo[item.properties.FIPS] || 0) + parseInt(item.properties.Confirmed);
      return memo;
    },
    {}
  );
  // console.log(county_confirmed_totals);
  var county_deaths_totals = _.reduce(
    data,
    function (memo, item) {
      memo[item.properties.FIPS] =
        (memo[item.properties.FIPS] || 0) + parseInt(item.properties.Deaths);
      return memo;
    },
    {}
  );
  // console.log(county_deaths_totals);
  return {
    confirmed_county_total: county_confirmed_totals,
    death_county_total: county_deaths_totals,
  };
};
var combined_county = function (data_totals) {
  //The data file clips 0's off the FIPS column, so we need to go back and
  //add them back in.
  var fix_fips = _.each(data_totals, function (total) {
    // keep track of the keys old and new
    var new_keys = [];
    var old_keys = [];
    //for each key lets replace make a new key from the old
    // add the result the the respective array (old and new)
    var a = _.each(Object.keys(total), function (fips) {
      var neww;
      old_keys.push(fips);
      // console.log(fips.length)
      if (fips.length === 2) {
        neww = "000" + fips;
        // console.log(neww);
        new_keys.push(neww);
      } else if (fips.length === 4) {
        neww = "0" + fips;
        // console.log(neww);
        new_keys.push(neww);
      } else {
        // console.log("else", fips);
        new_keys.push(fips);
      }
    });
    // console.log("new_keys_length", new_keys.length);
    // console.log("old_keys_length", old_keys.length);
    let i = 0;
    var b = _.map(old_keys, function (old_key) {
      if (old_key !== new_keys[i]) {
        Object.defineProperty(
          total,
          new_keys[i],
          Object.getOwnPropertyDescriptor(total, old_key)
        );
        delete total[old_key];
      }
      i++;
    });
    //creating fips data element on the counties geojson data file
    var c = _.each(CountyBoundaries.features, function (county) {
      county.properties.fips =
        county.properties["STATE"] + county.properties["COUNTY"];
    });
  });

  //adding the sorted and cleaned data to the counties geojson file
  //looping through the geojson file for each county
  let id = 0;
  var combined = _.map(CountyBoundaries.features, function (county_feature) {
    var county = county_feature.properties.fips;
    var nyc_confirmed_levels = data_totals["confirmed_county_total"]["36061"];
    var nyc_deaths_levels = data_totals["death_county_total"]["36061"];
    //if the county is not in the data totals
    if (
      !(county in data_totals["confirmed_county_total"]) ||
      !(county in data_totals["death_county_total"])
    ) {
      //kings, richmond, queens, bronx county data listed all under new york county
      if (
        county === "36047" ||
        county === "36005" ||
        county === "36081" ||
        county === "36085"
      ) {
        county_feature.properties.Confirmed = nyc_confirmed_levels;
        county_feature.properties.Deaths = nyc_deaths_levels;
        county_feature.id = id;
      }
      //for counties that have no prior data, assume 0
      else {
        county_feature.properties.Confirmed = 0;
        county_feature.properties.Deaths = 0;
        county_feature.id = id;
      }
    }
    //otherwise add the totals calculated earlier back to the geojson file
    else {
      // console.log(data_totals["confirmed_county_total"][county]);
      county_feature.properties.Confirmed =
        data_totals["confirmed_county_total"][county];

      // console.log(data_totals["death_county_total"][county]);
      county_feature.properties.Deaths =
        data_totals["death_county_total"][county];
      county_feature.id = id;
    }
    id++;
    return county_feature;
  });
  // console.log(combined);
  return combined;
};

//State Level Data Filtering
//filtering for only usa data at state level
//also removing some misc data that has USA listed as its country
const filter_us_data = function (data) {
  var us_subsect = [];
  _.map(data.features, function (feature) {
    // var not_in = ['Grand Princess', 'Diamond Princess', 'Wuhan Evacuee', 'Recovered'];
    // // console.log(not_in.indexOf(feature.properties.Province_State));
    // // console.log(feature.properties)
    // // if(feature.properties.)
    // if (not_in.indexOf(feature.properties.Province_State) >= 0) {
    //     delete feature;
    // }
    // console.log(feature)
    if (feature.properties["Country_Region"] === "US") {
      us_subsect.push(feature);
    }
  });
  // console.log(us_subsect);
  return us_subsect;
};
//reduce function boils list down to one number for each state
//utilizing it here to get one total for each state
const calc_totals = function (us_subsect_data) {
  // console.log(us_subsect_data)
  //calculate totals for each state;
  var confirmed_state_total = _.reduce(
    us_subsect_data,
    function (memo, item) {
      memo[item.properties.Province_State] =
        (memo[item.properties.Province_State] || 0) +
        parseInt(item.properties.Confirmed);
      return memo;
    },
    {}
  );
  // console.log(confirmed_state_total);
  var death_state_total = _.reduce(
    us_subsect_data,
    function (memo, item) {
      memo[item.properties.Province_State] =
        (memo[item.properties.Province_State] || 0) +
        parseInt(item.properties.Deaths);
      return memo;
    },
    {}
  );

  // recovered totals on hold for now, data is not being reported
  // var recovered_state_total = _.reduce(
  //   us_subsect_data,
  //   function (memo, item) {
  //     memo[item.properties.Province_State] =
  //       (memo[item.properties.Province_State] || 0) +
  //       parseInt(item.properties.Recovered);
  //     return memo;
  //   },
  //   {}
  // );
  // console.log(recovered_state_total);

  var total_death_us = 0;
  var count = 1;
  var us_death_total = _.each(death_state_total, function (state) {
    // console.log(death_state_total);
    // console.log(count);
    count += 1;
    total_death_us = total_death_us + state;
  });
  // console.log(total_death_us);
  var total_confirmed_us = 0;
  var us_confirmed_total = _.each(confirmed_state_total, function (state) {
    // console.log(state);
    total_confirmed_us = total_confirmed_us + state;
  });
  // console.log(total_confirmed_us);
  return {
    confirmed_state_total: confirmed_state_total,
    death_state_total: death_state_total,
    // recovered totals on hold for now, data is not being reported
    // recovered_state_total: recovered_state_total,
    us_death_total: total_death_us,
    us_confirmed_total: total_confirmed_us,
  };
};
//combining data back to one file
const combine_files = function (data_totals) {
  //add COVID-19 data to the states.js file
  StatesBoundaries.us_death_total = data_totals.us_death_total;
  StatesBoundaries.us_confirmed_total = data_totals.us_confirmed_total;
  var combined = _.each(StatesBoundaries.features, function (state_feature) {
    var state = state_feature.properties.name;
    state_feature.properties.Confirmed =
      data_totals["confirmed_state_total"][state];
    state_feature.properties.Deaths = data_totals["death_state_total"][state];

    // recovered totals on hold for now, data is not being reported
    // state_feature.properties.Recovered =
    //   data_totals["recovered_state_total"][state];
    delete state_feature.properties.density;
  });
  //  console.log(state_boundaries);
  return combined;
};
