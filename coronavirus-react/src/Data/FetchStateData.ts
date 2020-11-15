// @ts-nocheck
import csv2geojson, { csv } from "csv2geojson";
import StatesBoundaries from "./StateBoundaries.json";
import CountyBoundaries from "./CountyBoundaries.json";

//This function downloads the CSV File data, adds it to GEOJSON file, and then Filters it for the US State Subsect,
export const getStatesData = async (url: string): Promise<void> => {
  const statesData = await fetch(url)
    .then((response: Response) => {
      return response.text();
    })
    .then((response: String) => {
      if (!!response) {
        csv2geojson.csv2geojson(response, function (err: any, data: any) {
          // console.log(err); to do: add data of state values w/o fips to correct state
          let us_subsect = filterUSData(data);
          let calc_total = calcTotals(us_subsect);
          let combined_data = combineFiles(calc_total);
        });
      }
    });
  return statesData;
};

//State Level Data Filtering
//filtering for only usa data at state level
//also removing some misc data that has USA listed as its country
const filterUSData = function (data: any) {
  let us_subsect: any = [];
  data.features.map(function (feature) {
    if (feature.properties["Country_Region"] === "US") {
      us_subsect.push(feature);
    }
  });
  // console.log(us_subsect);
  return us_subsect;
};

//reduce function boils list down to one number for each state
//utilizing it here to get one total for each state
const calcTotals = (us_subsect_data: any) => {
  //calculate totals for each state;
  const confirmed_state_total = us_subsect_data.reduce(function (memo, item) {
    memo[item.properties.Province_State] =
      (memo[item.properties.Province_State] || 0) +
      parseInt(item.properties.Confirmed);
    return memo;
  }, {});

  const death_state_total = us_subsect_data.reduce(function (memo, item) {
    memo[item.properties.Province_State] =
      (memo[item.properties.Province_State] || 0) +
      parseInt(item.properties.Deaths);
    return memo;
  }, {});

  let us_death_total = 0;
  for (const state in death_state_total) {
    us_death_total += death_state_total[state];
  }

  let us_confirmed_total = 0;
  for (const state in confirmed_state_total) {
    us_confirmed_total += confirmed_state_total[state];
  }

  return {
    confirmed_state_total: confirmed_state_total,
    death_state_total: death_state_total,
    // recovered totals on hold for now, data is not being reported
    us_death_total: us_death_total,
    us_confirmed_total: us_confirmed_total,
  };
};

//combining data back to one file
const combineFiles = function (data_totals: any) {
  //add COVID-19 data to the states.js file
  StatesBoundaries.us_death_total = data_totals.us_death_total;
  StatesBoundaries.us_confirmed_total = data_totals.us_confirmed_total;
  const featuresArr = StatesBoundaries.features;
  let combined = featuresArr.map(function (state_feature) {
    let state = state_feature.properties.name;
    state_feature.properties.Confirmed =
      data_totals["confirmed_state_total"][state];
    state_feature.properties.Deaths = data_totals["death_state_total"][state];

    // recovered totals on hold for now, data is not being reported
    delete state_feature.properties.density;
  });
  //  console.log(state_boundaries);
  return combined;
};
