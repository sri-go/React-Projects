// @ts-nocheck
import { csv } from "csv2geojson";
import StatesBoundaries from "./StateBoundaries.json";
import CountyBoundaries from "./CountyBoundaries.json";

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
        month: "2-digit",
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

// Utility function that adds the state data to the State Boundaries GEOJSON file
const cleanStateData = (
  confirmedArray?: Array[],
  deathsArray?: Array[],
  callback: any
) => {
  const featuresArr = StatesBoundaries.features;
  if (!!confirmedArray) {
    let USConfirmedTotal = 0;
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
  }
  if (!!deathsArray) {
    let USDeathsTotal = 0;
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
  }
  // Add US Total into State Boundaries GEOJSON data
};

// Utility function that adds the state data to the State Boundaries GEOJSON file
const cleanCountyData = (
  confirmedArray?: Array[],
  deathsArray?: Array[]
): void => {
  const featuresArr = CountyBoundaries.features;
  if (!!confirmedArray) {
    featuresArr.map((countyFeature: any, index: number) => {
      const countyName = countyFeature.properties.NAME;
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
          ); //Previous two weeks total
        }
        // Alaska Kusilvak Census Area County
        else if (feature.FIPS === "02158") {
          if (countyName === "Wade Hampton") {
            countyFeature.properties.Confirmed = parseInt(feature.Confirmed);
            countyFeature.properties["TwoWeekTotal"] = parseInt(
              feature.TwoWeekTotal
            );
            countyFeature.properties.NAME = "Kusilvak Census Area";
          }
        }
        // Shannon County, SD is now Oglala Lakota County
        else if (feature.Admin2 === "Oglala Lakota") {
          if (countyName === "Shannon") {
            countyFeature.properties.Confirmed = parseInt(feature.Confirmed);
            countyFeature.properties["TwoWeekTotal"] = parseInt(
              feature.TwoWeekTotal
            );
            countyFeature.properties.NAME = "Oglala Lakota";
            countyFeature.properties.FIPS = feature.FIPS;
          }
        }
      });
    });
  }
  if (!!deathsArray) {
    featuresArr.map((countyFeature: any, index: number) => {
      const countyName = countyFeature.properties.NAME;
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
          ); //Previous two weeks total
        }
        // Alaska Kusilvak Census Area County
        else if (feature.FIPS === "02158") {
          if (countyName === "Wade Hampton") {
            countyFeature.properties.Deaths = parseInt(feature.Deaths);
            countyFeature.properties["TwoWeekDeathTotal"] = parseInt(
              feature.TwoWeekDeathTotal
            );
            countyFeature.properties.NAME = "Kusilvak Census Area";
          }
        }
        // Shannon County, SD is now Oglala Lakota County
        // else if (feature.Admin2 === "Oglala Lakota") {
        //   if (countyName === "Shannon") {
        //     countyFeature.properties.Deaths = parseInt(feature.Confirmed);
        //     countyFeature.properties["TwoWeekDeathTotal"] = parseInt(
        //       feature.TwoWeekDeathTotal
        //     );
        //     countyFeature.properties.NAME = "Oglala Lakota";
        //     countyFeature.properties.FIPS = feature.FIPS;
        //   }
        // }
      });
    });
  }
  return CountyBoundaries;
};

export const countryAnalysis = (array: any) => {
  // console.log(array);
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
  }
  if (!!deathsArray) {
    const filter = reduceData(undefined, deathsArray, dates);
    const fixedData = fixFips(filter);
    const stateData = cleanStateData(undefined, fixedData, callback);
    const countyData = cleanCountyData(undefined, fixedData);
  }
};
