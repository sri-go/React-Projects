// @ts-nocheck
import csv2geojson from "csv2geojson";
import CountyBoundaries from "./CountyBoundaries.json";

export const getCountiesData = async function (url: string): Promise<void> {
  const countyData = await fetch(url)
    .then((response: Response) => {
      return response.text();
    })
    .then((response: String) => {
      if (!!response) {
        csv2geojson.csv2geojson(response, function (err: any, data: any) {
          const us_only_counties = filterCounties(data);
          const calc_county_totals = countyTotals(us_only_counties);
          const combined_data = combinedCounty(calc_county_totals);
        });
      }
    });
  return countyData;
};

//County Level Data
/** 
const usOnlyCounties = function (data: any) {
  //filter out non-us data
  const not_in = ["66", "78"];
  if (not_in.indexOf(data.properties.FIPS) < 0 || data.properties.FIPS !== "") {
    return data;
  } else {
    return;
  }
};
*/
const filterCounties = function (data: any) {
  const filteredData = [];
  const usCounties = data.features.forEach(function (feature) {
    if (feature.properties.FIPS.length !== 0) {
      filteredData.push(feature);
    }
  });
  return filteredData;
};

const countyTotals = function (data: any) {
  //   console.log(data.length);
  const county_confirmed_totals = data.reduce(function (
    accumulator,
    currentVal
  ) {
    accumulator[currentVal.properties.FIPS] =
      (accumulator[currentVal.properties.FIPS] || 0) +
      parseInt(currentVal.properties.Confirmed);
    return accumulator;
  },
  {});
  const county_deaths_totals = data.reduce(function (accumulator, currentVal) {
    accumulator[currentVal.properties.FIPS] =
      (accumulator[currentVal.properties.FIPS] || 0) +
      parseInt(currentVal.properties.Deaths);
    return accumulator;
  }, {});
  return {
    confirmed_county_total: county_confirmed_totals,
    death_county_total: county_deaths_totals,
  };
};

const combinedCounty = function (data: any) {
  /*The data file clips 0's off the FIPS column, so we need to go back and add them back in.*/
  Object.keys(data).map((key) => {
    // keep track of the keys old and new
    let new_keys = [];
    let old_keys = [];
    let a = Object.keys(data[key]).map((key) => {
      let neww;
      old_keys.push(key);
      if (key.length === 2) {
        neww = "000" + key;
        // console.log(neww);
        new_keys.push(neww);
      } else if (key.length === 4) {
        neww = "0" + key;
        // console.log(neww);
        new_keys.push(neww);
      } else {
        // console.log("else", fips);
        new_keys.push(key);
      }
    });
    const b = old_keys.forEach(function (old_key, index) {
      if (old_key !== new_keys[index]) {
        Object.defineProperty(
          data[key], //object
          new_keys[index], //new key
          Object.getOwnPropertyDescriptor(data[key], old_key) //value
        );
        delete data[key][old_key]; //delete old key
      }
    });
    const c = CountyBoundaries.features.forEach(function (county) {
      county.properties.fips =
        county.properties["STATE"] + county.properties["COUNTY"];
    });
  });

  //adding the sorted and cleaned data to the counties geojson file
  //looping through the geojson file for each county
  let id = 0;
  const combined = CountyBoundaries.features.map(function (county_feature) {
    let county = county_feature.properties.fips;
    let nyc_confirmed_levels = data["confirmed_county_total"]["36061"];
    let nyc_deaths_levels = data["death_county_total"]["36061"];
    //if the county is not in the data totals
    if (
      !(county in data["confirmed_county_total"]) ||
      !(county in data["death_county_total"])
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
      //for counties that have no prior data, assume 0 -> need to fix
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
        data["confirmed_county_total"][county];

      // console.log(data_totals["death_county_total"][county]);
      county_feature.properties.Deaths = data["death_county_total"][county];
      county_feature.id = id;
    }
    id++;
    return county_feature;
  });
  return combined;
};
