// @ts-nocheck
import StatesBoundaries from "./StateBoundaries.json";
import CountyBoundaries from "./CountyBoundaries.json";
// @ts-ignore
import { csv } from "csv2geojson";

// Fetch data from Github
export const fetchData = async () => {
   const rawData = await Promise.all([
     fetch(
       "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"
     ),
     fetch(
       "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv"
     ),
   ]);
  try {
    const parsedData = await Promise.all(
      rawData.map((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const convertedData = response.text();
        return convertedData;
      })
    );
    const cleanedData = await Promise.all(
      parsedData.map((string) => {
        return csv(string);
      })
    );
    return cleanedData;
  } catch (error) {
    console.log(error);
  }
};

// Utility function that returns the last two weeks of dates;
export const getDates = () => {
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

export const countryAnalysis = (confirmedArray?: any, deathsArray?: any) => {
  let finalObj: any = [];
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
      const val: any = {}; //Return obj
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
      const val: any = {}; //Return obj
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

export const countryTotals = (feature: Object) => {
  let stateTotals = [];
  data.features.map((feature: any, index: number) => {
    const confirmedTotal = feature.properties.Confirmed;
    const deathsTotal = feature.properties.Deaths;
    stateTotals.push([feature.properties.name, confirmedTotal, deathsTotal]);
  });

  const stateConfirmedSorted = stateTotals.sort((a, b) => {
    return b[1] - a[1];
  });

  // console.log(stateConfirmedSorted);

  const stateDeathsSorted = stateTotals.sort((a, b) => {
    return b[2] - a[2];
  });

  // console.log(stateDeathsSorted);

  return {
    confirmedSorted: stateConfirmedSorted,
    deathsSorted: stateDeathsSorted,
  };
};

export const filterData = (
  fetchedData: Array<Object>,
  dataName: string,
  callback?: any
): void => {
  const dates = getDates();
  // @ts-ignore
  const cleanedData = cleanData(fetchedData, dataName, dates);
  const stateData = cleanStateData(cleanedData, dataName, callback);
  // const countyData = cleanCountyData(cleanedData, dataName[index]);
};

// Utility function that removes unnecessary keys in raw data
const cleanData = (
  rawData: Array<Object>,
  dataName: string,
  datesArray: Array<string>
): Array<Object> => {
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

  const cleanedData = [];
  const firstDate = datesArray[0];
  const lastDate = datesArray[datesArray.length - 1];
  rawData.map((feature, index) => {
    // for each Key in the Feature remove anything that isn't in this list and return the rest
    const tempObj = {};

    const twoWeekTotal = parseInt(feature[lastDate] - feature[firstDate]);
    const currentTotal = parseInt(feature[lastDate]);

    if (dataName === "Confirmed") {
      tempObj["Confirmed_Cases"] = currentTotal;
      tempObj["TwoWeekConfirmedTotal"] = twoWeekTotal;
    } else {
      tempObj["Confirmed_Deaths"] = currentTotal;
      tempObj["TwoWeekDeathTotal"] = twoWeekTotal;
    }

    includeKeys.map((key, index) => {
      return (tempObj[key] = feature[key]);
    });

    // Fix FIPS Codes
    const FIPS_CODE = tempObj.FIPS.split(".")[0];
    if (FIPS_CODE.length === 2) {
      tempObj.FIPS = "000" + FIPS_CODE;
    } else if (FIPS_CODE.length === 3) {
      tempObj.FIPS = "00" + FIPS_CODE;
    } else if (FIPS_CODE.length === 4) {
      tempObj.FIPS = "0" + FIPS_CODE;
    } else {
      tempObj.FIPS = FIPS_CODE;
    }

    return cleanedData.push(tempObj);
  });
  // console.log(cleanedData)
  return cleanedData;
};

// WIP adding population data
// Function that adds Population to State Boundaries GEOJSON file
const addPopulation = (array: Array<any>, populationData: any) => {};

// Function that adds the state data to the State Boundaries GEOJSON file
const cleanStateData = (
  data: Array<Object>,
  dataName: string,
  callback?: (Total: Object) => void
): void => {
  const featuresArr = StatesBoundaries.features;

  let USConfirmedTotal = 0;
  let USDeathsTotal = 0;
  let stateTotals = [];

  featuresArr.map((feature: Object) => {
    // initally check if the property exists in the feature
    if (!(feature.properties["Confirmed_Cases"] in feature)) {
      feature.properties["Confirmed_Cases"] = 0;
    }
    if (!(feature.properties["TwoWeekConfirmedTotal"] in feature)) {
      feature.properties["TwoWeekConfirmedTotal"] = 0;
    }
    if (!(feature.properties["Confirmed_Deaths"] in feature)) {
      feature.properties["Confirmed_Deaths"] = 0;
    }
    if (!(feature.properties["TwoWeekDeathTotal"] in feature)) {
      feature.properties["TwoWeekDeathTotal"] = 0;
    }

    data.map((dataFeature: any, index: number) => {
      // check if the state is in the state boundaries array
      if (feature.properties.name === dataFeature.Province_State) {
        if (dataName === "Confirmed") {
          USConfirmedTotal += dataFeature["Confirmed_Cases"];
          feature.properties.Confirmed_Cases += dataFeature["Confirmed_Cases"];
          feature.properties["TwoWeekConfirmedTotal"] +=
            dataFeature["TwoWeekConfirmedTotal"];
        }
        if (dataName === "Deaths") {
          USDeathsTotal += dataFeature["Confirmed_Deaths"];
          feature.properties.Confirmed_Deaths +=
            dataFeature["Confirmed_Deaths"];
          feature.properties["TwoWeekDeathTotal"] +=
            dataFeature["TwoWeekDeathTotal"];
        }
      }
    });

    const confirmedTotal = feature.properties.Confirmed_Cases;
    const deathsTotal = feature.properties.Confirmed_Deaths;
    stateTotals.push([feature.properties.name, confirmedTotal, deathsTotal]);
  });
  console.log(featuresArr)
};

// Function that adds the county data to the County Boundaries GEOJSON file
const cleanCountyData = (data: Array<Object>, dataName: string) => {
  // @ts-ignore
  const featuresArr = CountyBoundaries.features;

  featuresArr.map((countyFeature: any, index: number) => {
    const stateCode = countyFeature.properties.STATE;
    const countyCode = countyFeature.properties.COUNTY;
    const FIPS = stateCode + countyCode;
    countyFeature.properties.FIPS = FIPS; //creating FIPS column since no FIPS is included
    countyFeature.id = index; //creating ID value since no ID is included in data

    data.map((feature: any, index: number) => {
      if (feature.FIPS === FIPS) {
        if (dataName === "Confirmed") {
          countyFeature.properties["Confirmed_Cases"] = parseInt(
            feature.Confirmed
          ); //Cumulative total
          countyFeature.properties["TwoWeekConfirmedTotal"] = parseInt(
            feature.TwoWeekTotal
          );
        } else {
          countyFeature.properties["Confirmed_Deaths"] = parseInt(
            feature.Confirmed
          ); //Cumulative total
          countyFeature.properties["TwoWeekDeathTotal"] = parseInt(
            feature.TwoWeekTotal
          );
        }
      }
    });
  });
  return CountyBoundaries;
};