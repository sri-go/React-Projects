// @ts-nocheck
import { csv } from "csv2geojson";
import StatesBoundaries from "./StateBoundaries.json";
import CountyBoundaries from "./CountyBoundaries.json";
import PopulationData from "./PopulationData.csv";

// Fetch data from Github
export const fetchData = async function (url: string) {
  const timeSeries = await fetch(url)
    .then((response) => {
      return response.text();
    })
    .then((response) => {
      return csv(response);
    });
  return timeSeries;
};

// Utility function that returns the last two weeks of dates;
const getDates = () => {
  //Filtering by date, I want to only get the data for the past 2 weeks
  const date = new Date();
  date.setDate(date.getDate() - 16);
  //creating a new array of keys that I want to select in the objs
  let newDates = [];
  for (let i = 0; i < 15; i++) {
    date.setDate(date.getDate() + 1);
    newDates.push(
      date.toLocaleDateString("en-us", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      })
    );
  }
  return newDates;
};

// Utility function that filters data for the latest date (Current date - 1)
const reduceData = (
  confirmedArray?: Array[],
  deathsArray?: Array[],
  datesArray?: any
): Array[] => {
  const includeKeys = [
    "Admin2",
    "Combined_Key",
    "Country_Region",
    "FIPS",
    "Lat",
    "Long_",
    "Province_State",
    "UID",
    "code3",
    "iso2",
    "iso3",
  ];
  const finalDataObj: any = [];

  const firstDate = datesArray[0];
  const lastDate = datesArray[datesArray.length - 1];
  if (!!confirmedArray) {
    confirmedArray.map((feature: any, index: number) => {
      const tempObj: any = {};
      const twoWeekTotal = feature[lastDate] - feature[firstDate];
      const currentTotal = feature[lastDate];
      tempObj["Confirmed"] = currentTotal;
      tempObj["TwoWeekTotal"] = twoWeekTotal;
      includeKeys.map((key, index) => {
        tempObj[key] = feature[key];
      });
      finalDataObj.push(tempObj);
    });
  }
  if (!!deathsArray) {
    deathsArray.map((feature: any, index: number) => {
      const tempObj: any = {};
      const twoWeekTotal = feature[lastDate] - feature[firstDate];
      const currentTotal = feature[lastDate];
      tempObj["Deaths"] = currentTotal;
      tempObj["TwoWeekDeathTotal"] = twoWeekTotal;
      includeKeys.map((key, index) => {
        tempObj[key] = feature[key];
      });
      finalDataObj.push(tempObj);
    });
  }
  return finalDataObj;
};

// Utility function to fix the FIPS on the data
const fixFips = (array: Array[]) => {
  array.map((feature: any, index: number) => {
    const FIPS = feature.FIPS.split(".")[0];
    if (FIPS.length === 2) {
      feature.FIPS = "000" + FIPS;
    } else if (FIPS.length === 3) {
      feature.FIPS = "00" + FIPS;
    } else if (FIPS.length === 4) {
      feature.FIPS = "0" + FIPS;
    } else {
      feature.FIPS = FIPS;
    }
  });
  return array;
};

// Utility function that adds Population to State Boundaries GEOJSON file
const addPopulation = (array?: Array[], populationData: any) => {
  // console.log(typeof populationData);
};

// Utility function that adds the state data to the State Boundaries GEOJSON file
const cleanStateData = (
  confirmedArray?: Array[],
  deathsArray?: Array[],
  callback: any
) => {
  const featuresArr = StatesBoundaries.features;
  if (!!confirmedArray) {
    let USConfirmedTotal = 0;
    let stateTotals = [];
    featuresArr.map((feature: any, index: number) => {
      const state = feature.properties.name;
      let stateTotal = 0;
      let stateTwoWeekTotal = 0;
      // loop over response data and check for the current STATE
      // if matches then add to total;
      confirmedArray.map((feature: any, index: number) => {
        if (feature.Province_State === state) {
          stateTotal += parseInt(feature.Confirmed); //Cumulative total
          stateTwoWeekTotal += parseInt(feature.TwoWeekTotal); //Previous two weeks total
        }
      });
      //finally add back to States Boundaries GeoJSON data
      feature.properties["Confirmed"] = stateTotal;
      feature.properties["TwoWeekTotal"] = stateTwoWeekTotal;
      USConfirmedTotal += stateTotal;
    });
    StatesBoundaries["USConfirmedTotal"] = USConfirmedTotal;
    callback({
      USConfirmedTotal: USConfirmedTotal,
    });
    featuresArr.map((feature: any, index: any) => {
      const confirmedTotal = feature.properties.Confirmed;
      stateTotals.push([feature.properties.name, confirmedTotal]);
    });
    const stateConfirmedSorted = stateTotals.sort((a, b) => {
      return b[1] - a[1];
    });
    console.log(stateConfirmedSorted);

    return stateConfirmedSorted;
  }
  if (!!deathsArray) {
    let USDeathsTotal = 0;
    let stateTotals = [];

    featuresArr.map((feature: any, index: number) => {
      const state = feature.properties.name;
      let stateTotal = 0;
      let stateTwoWeekDeathTotal = 0;
      // loop over response data and check for the current STATE
      // if matches then add to total;
      deathsArray.map((feature: any, index: number) => {
        if (feature.Province_State === state) {
          stateTotal += parseInt(feature.Deaths); //Cumulative total
          stateTwoWeekDeathTotal += parseInt(feature.TwoWeekDeathTotal); //Previous two weeks total
        }
      });
      //finally add back to States Boundaries GeoJSON data
      feature.properties["Deaths"] = stateTotal;
      feature.properties["TwoWeekDeathTotal"] = stateTwoWeekDeathTotal;
      USDeathsTotal += stateTotal;
    });

    StatesBoundaries["USDeathsTotal"] = USDeathsTotal;
    callback({
      USDeathsTotal: USDeathsTotal,
    });
    
    featuresArr.map((feature: any, index: any) => {
      const deathsTotal = feature.properties.Deaths;
      stateTotals.push([feature.properties.name, deathsTotal]);
    });
    
    const stateDeathsSorted = stateTotals.sort((a, b) => {
      return b[1] - a[1];
    });
    console.log(stateDeathsSorted);

    return stateDeathsSorted;
  }
  // Add US Total into State Boundaries GEOJSON data
};

// Utility function that adds the county data to the County Boundaries GEOJSON file
const cleanCountyData = (
  confirmedArray?: Array[],
  deathsArray?: Array[]
): void => {
  const featuresArr = CountyBoundaries.features;
  if (!!confirmedArray) {
    featuresArr.map((countyFeature: any, index: number) => {
      const stateCode = countyFeature.properties.STATE;
      const countyCode = countyFeature.properties.COUNTY;
      const FIPS = stateCode + countyCode;
      countyFeature.properties.FIPS = FIPS;
      countyFeature.id = index;
      confirmedArray.map((feature: any, index: number) => {
        if (feature.FIPS === FIPS) {
          countyFeature.properties["Confirmed"] = parseInt(feature.Confirmed); //Cumulative total
          countyFeature.properties["TwoWeekTotal"] = parseInt(
            feature.TwoWeekTotal
          );
        }
      });
    });
  }
  if (!!deathsArray) {
    featuresArr.map((countyFeature: any, index: number) => {
      const stateCode = countyFeature.properties.STATE;
      const countyCode = countyFeature.properties.COUNTY;
      const FIPS = stateCode + countyCode;
      countyFeature.properties.FIPS = FIPS;
      countyFeature.id = index;
      deathsArray.map((feature: any, index: number) => {
        if (feature.FIPS === FIPS) {
          countyFeature.properties.Deaths = parseInt(feature.Deaths); //Cumulative total
          countyFeature.properties["TwoWeekDeathTotal"] = parseInt(
            feature.TwoWeekDeathTotal
          );
        }
      });
    });
  }
  return CountyBoundaries;
};

export const countryAnalysis = (confirmedArray?: any, deathsArray?: any) => {
  let finalObj = [];
  //Things we don't need to parse
  const excludeKeys = [
    "UID",
    "iso2",
    "iso3",
    "code3",
    "FIPS",
    "Admin2",
    "Province_State",
    "Country_Region",
    "Lat",
    "Long_",
    "Combined_Key",
    "Population",
  ];
  if (!!confirmedArray) {
    // Intialize all key/value pairs to 0
    const firstElement = confirmedArray[0];
    const keys = Object.keys(firstElement);
    keys.map((key: string, index: number) => {
      const val = {}; //Return obj
      if (excludeKeys.indexOf(key) < 0) {
        val.x = new Date(key);
        val.y = 0;
      }
      finalObj.push(val);
    });
    // Loop over each feature in array and add the count to final obj
    confirmedArray.map((feature: any, index: number) => {
      if (feature.Country_Region === "US") {
        const keys = Object.keys(feature);
        keys.map((key: any, keyIndex: number) => {
          if (excludeKeys.indexOf(key) < 0) {
            finalObj[keyIndex].y += parseInt(feature[key]);
          }
        });
      }
    });
    // Remove first 11 objs -> empty
    finalObj = finalObj.slice(11);
    return finalObj;
  }
  if (!!deathsArray) {
    // Intialize all key/value pairs to 0
    const firstElement = deathsArray[0];
    const keys = Object.keys(firstElement);
    keys.map((key: string, index: number) => {
      const val = {}; //Return obj
      if (excludeKeys.indexOf(key) < 0) {
        val.x = new Date(key);
        val.y = 0;
      }
      finalObj.push(val);
    });
    // Loop over each feature in array and add the count to final obj
    deathsArray.map((feature: any, index: number) => {
      if (feature.Country_Region === "US") {
        const keys = Object.keys(feature);
        keys.map((key: any, keyIndex: number) => {
          if (excludeKeys.indexOf(key) < 0) {
            finalObj[keyIndex].y += parseInt(feature[key]);
          }
        });
      }
    });
    // Remove first 11 objs -> empty
    finalObj = finalObj.slice(12);
    return finalObj;
  }
};

export const countryTotals = (data: any) => {
  let stateTotals = [];
  data.features.map((feature: any, index: number) => {
    const confirmedTotal = feature.properties.Confirmed;
    const deathsTotal = feature.properties.Deaths;
    stateTotals.push([feature.properties.name, confirmedTotal, deathsTotal]);
  });

  const stateConfirmedSorted = stateTotals.sort((a, b) => {
    return b[1] - a[1];
  });

  console.log(stateConfirmedSorted);

  const stateDeathsSorted = stateTotals.sort((a, b) => {
    return b[2] - a[2];
  });

  console.log(stateDeathsSorted);

  return {
    confirmedSorted: stateConfirmedSorted,
    deathsSorted: stateDeathsSorted,
  };
};

export const filterData = (
  confirmedArray?: Array[],
  deathsArray?: Array[],
  callback?: any
): void => {
  const dates = getDates();
  if (!!confirmedArray) {
    const filter = reduceData(confirmedArray, undefined, dates);
    const fixedData = fixFips(filter);
    const stateData = cleanStateData(fixedData, undefined, callback);
    const countyData = cleanCountyData(fixedData, undefined);
    return stateData;
  }
  if (!!deathsArray) {
    const filter = reduceData(undefined, deathsArray, dates);
    const fixedData = fixFips(filter);
    const stateData = cleanStateData(undefined, fixedData, callback);
    const countyData = cleanCountyData(undefined, fixedData);
    const withPop = addPopulation(undefined, PopulationData);
  }
};
