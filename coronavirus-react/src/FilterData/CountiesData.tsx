//This function downloads the CSV File data, adds it to GEOJSON file, and then Filters it for the US Counties Subsect,
var get_county_data = function (url) {
  var download = $.ajax({
    url: url,
  });
  var combined_promise = download.done(function (downloaded_data) {
    if (typeof downloaded_data !== "undefined") {
      csv2geojson.csv2geojson(downloaded_data, function (err, data) {
        var us_only_counties = filter_counties(data);
        var calc_county_totals = county_totals(us_only_counties);
        var combined_data = combined_county(calc_county_totals);
      });
    }
  });

  //County Level Data
  var filter_us_county_data = function (data) {
    //filter our GUAM, VIRGIN ISLANDS
    var not_in = ["66", "78"];
    if (not_in.indexOf(data.properties.FIPS) >= 0) {
      delete data;
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
          (memo[item.properties.FIPS] || 0) +
          parseInt(item.properties.Confirmed);
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
          // console.log('else',fips);
          new_keys.push(fips);
        }
      });
      // console.log('new_keys_length',new_keys.length);
      // console.log('old_keys_length',old_keys.length);
      i = 0;
      var b = _.map(old_keys, function (key) {
        if (key !== new_keys[i]) {
          Object.defineProperty(
            total,
            new_keys[i],
            Object.getOwnPropertyDescriptor(total, key)
          );
          delete total[key];
        }
        i++;
      });
      //creating fips data element on the counties geojson data file
      var c = _.each(county_boundaries.features, function (county) {
        county.properties.fips =
          county.properties["STATE"] + county.properties["COUNTY"];
      });
    });
    //adding the sorted and cleaned data to the counties geojson file
    id = 01;
    var combined = _.map(county_boundaries.features, function (county_feature) {
      var county = county_feature.properties.fips;
      var nyc_confirmed_levels = data_totals["confirmed_county_total"]["36061"];
      var nyc_deaths_levels = data_totals["death_county_total"]["36061"];
      if (
        !(county in data_totals["confirmed_county_total"]) ||
        !(county in data_totals["death_county_total"])
      ) {
        if (
          county === "36047" ||
          county === "36005" ||
          county === "36081" ||
          county === "36085"
        ) {
          county_feature.properties.Confirmed = nyc_confirmed_levels;
          county_feature.properties.Deaths = nyc_deaths_levels;
          county_feature.id = id;
        } else {
          county_feature.properties.Confirmed = 0;
          county_feature.properties.Deaths = 0;
          county_feature.id = id;
        }
      } else {
        county_feature.properties.Confirmed =
          data_totals["confirmed_county_total"][county];
        county_feature.properties.Deaths =
          data_totals["death_county_total"][county];
        county_feature.id = id;
      }
      id++;
    });
    return combined;
  };
  return combined_promise;
};
