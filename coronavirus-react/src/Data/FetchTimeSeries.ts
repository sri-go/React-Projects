//@ts-ignore
import { csv } from "csv2geojson";
import StatesBoundaries from "./StateBoundaries.json";

// Data for 2-week
export const getTimeSeries = async function (url: string) {
  const timeSeries = await fetch(url)
    .then((response) => {
      return response.text();
    })
    .then((response) => {
      return csv(response);
    });
  return timeSeries;
};

export const countryAnalysis = (array: any) => {
  // console.log(array);
};

export const filterDates = () => {
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

const filterForState = (array: any, feature: any) => {
  let temp: any = [];
  array.map((element: any) => {
    //find the values for the selected state from raw data
    //if the element matches the selected feature begin further filtering
    if (element.Province_State === feature.properties.name) {
      temp.push(element);
    }
  });

  return temp;
};

const filterForCounty = (array: any, datesArray: any, feature: any) => {
  // Properties to exclude from the count
  const excludeKeys = [
    "Admin2",
    "Combined_Key",
    "Country_Region",
    "FIPS",
    "Lat",
    "Long_",
    "Population",
    "Province_State",
    "UID",
    "code3",
    "iso2",
    "iso3",
  ];
  const state = feature.properties.name; // State name
  const obj: any = {}; //Initalize the final object that will be returned
  obj[state] = {}; //Initalize an object with the state name as a property
  obj[state]["TotalCasesOverTime"] = []; //Initalize new array for cumulative count of cases
  obj[state]["TotalNewCases"] = []; //Initalize new array for delta in cases
  obj[state]["DailyChangeKeys"] = []; //Temporary array to hold values
  obj[state]["NewCases"] = []; //Temporary array to hold values

  /**
   * Loop over each key (date) in the first element and create
   * and add create a new date with the key
   */

  for (let key in array[0]) {
    let value: any = {}; //holds the value of the key (date) and the cases at that key
    let other_value: any = {}; //holds...
    if (excludeKeys.indexOf(key) < 0) {
      obj[state]["TotalNewCases"].push(other_value);
      value.x = new Date(key);
      value.y = 0;
      obj[state]["TotalCasesOverTime"].push(value);
      obj[state]["DailyChangeKeys"].push(key);
    }
  }
  /**
   * Loop through each county and tabulate counts of cases
   */
  array.map((county: any) => {
    const tempArray: any = []; //This is temporary to hold values of each county
    const countyName = county.Admin2; // County Name
    obj[state][countyName] = {}; //Create a new object for each county

    const tempdailyChange = []; //Array holds daily change val for each county

    let totalCases = 0; //This will be the final value for each county
    let twoWeekTotal = 0; //This will be the difference between last val and 13day val

    /**
     * Loop over each date in each county
     */
    for (let key in county) {
      // If key (date) is the last date in the dates array
      // Add a Total-Cases property to the object
      if (key === datesArray[datesArray.length - 1]) {
        totalCases = totalCases + parseInt(county[key]);
        obj[state][countyName]["Total-Cases"] = totalCases;
      }

      //Calculate difference between values for each county
      if (excludeKeys.indexOf(key) < 0) {
        const { DailyChangeKeys } = obj[state];

        //Calculate Diff in count between previous and current date
        let diff =
          parseInt(county[DailyChangeKeys[DailyChangeKeys.indexOf(key) + 1]]) -
          parseInt(county[key]);

        //Add to Temp Array
        tempdailyChange.push({ x: new Date(key), y: diff });

        // Add case count for each day to temp array for use in Total New Case Count
        tempArray.push(parseInt(county[key]));
      }
    }

    // Daily Change in Cases Over Time For County -> Every value except last, which is "NaN"
    obj[state][countyName]["NewCases"] = tempdailyChange.slice(
      0,
      tempdailyChange.length - 1
    );

    //Daily New Cases For State
    obj[state][countyName]["NewCases"].forEach((value: any, index: number) => {
      if (Object.keys(obj[state]["TotalNewCases"][index]).length === 0) {
        let { x: countyX, y: countyY } = value;
        obj[state]["TotalNewCases"][index].x = countyX;
        obj[state]["TotalNewCases"][index].y = countyY;
      } else {
        let { y: newVal } = value;
        let { y: currentVal } = obj[state]["TotalNewCases"][index];
        currentVal = currentVal + newVal;
        obj[state]["TotalNewCases"][index].y = currentVal;
      }
    });

    // Two Week Total Number of Cases
    const finalDate = datesArray[datesArray.length - 1];
    const firstDate = datesArray[0];

    twoWeekTotal = county[finalDate] - county[firstDate];
    obj[state][countyName].twoWeekTotal = twoWeekTotal; // 2-week total for each county

    // Total Cases Over Time For State
    obj[state]["TotalCasesOverTime"].map((value: any, index: number) => {
      value.y = value.y + tempArray[index];
    });
  });
  // Remove last value, "NaN" in Total New Cases for State
  obj[state]["TotalNewCases"] = obj[state]["TotalNewCases"].slice(
    0,
    obj[state]["TotalNewCases"].length - 1
  );

  delete obj[state]["DailyChangeKeys"];
  delete obj[state]["NewCases"];
  return obj;
};

// @ts-ignore
const filterTop10 = (obj: any, feature?: any) => {
  const state = feature.properties.name;
  const excludeKeys = ["TotalCasesOverTime", "TotalNewCases"];
  const top10 = []; //Temp arr to hold total case count
  const countyNames = []; //Temp array to hold county names
  let top10Counties = {};

  // loop through all counties and add to county array
  for (const county in obj[state]) {
    if (excludeKeys.indexOf(county) < 0) {
      top10.push(obj[state][county]["Total-Cases"]);
    }
  }
  // Returns top 10 vals in order
  const topValues = top10.sort((a, b) => b - a).slice(0, 10);

  for (const county in obj[state]) {
    // check if value for that county is in top values array
    if (topValues.indexOf(obj[state][county]["Total-Cases"]) >= 0) {
      countyNames.push(county);
      //@ts-ignore
      top10Counties[county] = obj[state][county]["Total-Cases"];
    }
  }
  return top10Counties;
};

export const StateTwoWeekData = (array: any, datesArray: any) => {
  const featuresArr = StatesBoundaries.features;
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
  const twoWeekObj: any = [];

  const firstDate = datesArray[0];
  const lastDate = datesArray[datesArray.length - 1];

  array.map((feature: any, index: number) => {
    const tempObj: any = {};
    const twoWeekTotal = feature[lastDate] - feature[firstDate];
    tempObj["TwoWeekTotal"] = twoWeekTotal;
    includeKeys.map((key, index) => {
      tempObj[key] = feature[key];
    });
    twoWeekObj.push(tempObj);
  });

  console.log(twoWeekObj);

  featuresArr.map((feature: any, index: number) => {
    const state = feature.properties.name;
    let stateTotal = 0;
    twoWeekObj.map((feature: any, index: number) => {
      if (feature.Province_State === state) {
        stateTotal += feature.TwoWeekTotal;
      }
    });
    feature.properties["TwoWeekTotal"] = stateTotal;
  });
  return StatesBoundaries;
};

export const filterData = (array: any, feature: any): any => {
  if (!!array) {
    const dates = filterDates();
    const filterState = filterForState(array, feature);
    const filterCounty = filterForCounty(filterState, dates, feature);
    const filterTop = filterTop10(filterCounty, feature);
    return {
      filterState: filterState,
      filterCounty: filterCounty,
      top10: filterTop,
    };
  }
};

