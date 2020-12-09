//@ts-nocheck
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

const filterForState = (
  confirmedArray?: Array[],
  deathsArray?: Array[],
  feature: any
) => {
  let temp: any = [];
  if (!!confirmedArray) {
    confirmedArray.map((element: any) => {
      //find the values for the selected state from raw data
      //if the element matches the selected feature begin further filtering
      if (element.Province_State === feature.properties.name) {
        temp.push(element);
      }
    });
  }
  if (!!deathsArray) {
    deathsArray.map((element: any) => {
      //find the values for the selected state from raw data
      //if the element matches the selected feature begin further filtering
      if (element.Province_State === feature.properties.name) {
        temp.push(element);
      }
    });
  }
  return temp;
};

const filterForCounty = (
  confirmedArray?: any,
  deathsArray?: any,
  datesArray: any,
  feature: any
) => {
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

  if (!!confirmedArray) {
    // Properties to exclude from the count
    obj[state]["TotalCasesOverTime"] = []; //Initalize new array for cumulative count of cases
    obj[state]["TotalNewCases"] = []; //Initalize new array for delta in cases
    obj[state]["DailyChangeKeys"] = []; //Temporary array to hold values
    obj[state]["NewCases"] = []; //Temporary array to hold values

    /**
     * Loop over each key (date) in the first element and create
     * and add create a new date with the key
     */

    for (let key in confirmedArray[0]) {
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
    confirmedArray.map((county: any) => {
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
            parseInt(
              county[DailyChangeKeys[DailyChangeKeys.indexOf(key) + 1]]
            ) - parseInt(county[key]);

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
      obj[state][countyName]["NewCases"].forEach(
        (value: any, index: number) => {
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
        }
      );

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
  }
  if (!!deathsArray) {
    obj[state]["TotalDeathsOverTime"] = []; //Initalize new array for cumulative count of cases
    obj[state]["TotalNewDeaths"] = []; //Initalize new array for delta in cases
    obj[state]["DailyChangeKeys"] = []; //Temporary array to hold values
    obj[state]["NewDeaths"] = []; //Temporary array to hold values
    /**
     * Loop over each key (date) in the first element and create
     * and add create a new date with the key
     */
    for (let key in deathsArray[0]) {
      let value: any = {}; //holds the value of the key (date) and the cases at that key
      let other_value: any = {}; //holds...
      if (excludeKeys.indexOf(key) < 0) {
        obj[state]["TotalNewDeaths"].push(other_value);
        value.x = new Date(key);
        value.y = 0;
        obj[state]["TotalDeathsOverTime"].push(value);
        obj[state]["DailyChangeKeys"].push(key);
      }
    }

    deathsArray.map((county: any) => {
      const tempArray: any = []; //This is temporary to hold values of each county
      const countyName = county.Admin2; // County Name
      obj[state][countyName] = {}; //Create a new object for each county

      const tempdailyChange = []; //Array holds daily change val for each county

      let totalDeaths = 0; //This will be the final value for each county
      let twoWeekDeathTotal = 0; //This will be the difference between last val and 13day val

      /**
       * Loop over each date in each county
       */
      for (let key in county) {
        // If key (date) is the last date in the dates array
        // Add a Total-Cases property to the object
        if (key === datesArray[datesArray.length - 1]) {
          totalDeaths = totalDeaths + parseInt(county[key]);
          obj[state][countyName]["Total-Deaths"] = totalDeaths;
        }

        //Calculate difference between values for each county
        if (excludeKeys.indexOf(key) < 0) {
          const { DailyChangeKeys } = obj[state];

          //Calculate Diff in count between previous and current date
          let diff =
            parseInt(
              county[DailyChangeKeys[DailyChangeKeys.indexOf(key) + 1]]
            ) - parseInt(county[key]);

          //Add to Temp Array
          tempdailyChange.push({ x: new Date(key), y: diff });

          // Add case count for each day to temp array for use in Total New Case Count
          tempArray.push(parseInt(county[key]));
        }
      }

      // Daily Change in Cases Over Time For County -> Every value except last, which is "NaN"
      obj[state][countyName]["NewDeaths"] = tempdailyChange.slice(
        0,
        tempdailyChange.length - 1
      );

      //Daily New Cases For State
      obj[state][countyName]["NewDeaths"].forEach(
        (value: any, index: number) => {
          if (Object.keys(obj[state]["TotalNewDeaths"][index]).length === 0) {
            let { x: countyX, y: countyY } = value;
            obj[state]["TotalNewDeaths"][index].x = countyX;
            obj[state]["TotalNewDeaths"][index].y = countyY;
          } else {
            let { y: newVal } = value;
            let { y: currentVal } = obj[state]["TotalNewDeaths"][index];
            currentVal = currentVal + newVal;
            obj[state]["TotalNewDeaths"][index].y = currentVal;
          }
        }
      );

      // Two Week Total Number of Cases
      const finalDate = datesArray[datesArray.length - 1];
      const firstDate = datesArray[0];

      twoWeekDeathTotal = county[finalDate] - county[firstDate];
      obj[state][countyName].twoWeekDeathTotal = twoWeekDeathTotal; // 2-week total for each county

      // Total Cases Over Time For State
      obj[state]["TotalDeathsOverTime"].map((value: any, index: number) => {
        value.y = value.y + tempArray[index];
      });
    });
    // Remove last value, "NaN" in Total New Cases for State
    obj[state]["TotalNewDeaths"] = obj[state]["TotalNewDeaths"].slice(
      0,
      obj[state]["TotalNewDeaths"].length - 1
    );

    delete obj[state]["DailyChangeKeys"];
    delete obj[state]["NewDeaths"];
  }
  return obj;
};

const filterTop10 = (obj: any, feature?: any) => {
  console.log(obj);
  const state = feature.properties.name;
  const excludeKeys = [
    "TotalCasesOverTime",
    "TotalNewCases",
    "Unassigned",
    "TotalDeathsOverTime",
    "TotalNewDeaths",
  ];
  const temp = [];
  //Confirmed Cases
  const TotalConfirmed = []; //Temp arr to hold total case count
  const TwoWeekConfirmed = []; //Temp arr to hold two week case count

  // loop through all counties and add to county array
  for (const county in obj[state]) {
    if (excludeKeys.indexOf(county) < 0) {
      temp.push([county, obj[state][county]]);
    }
  }

  temp
    .sort(function (a, b) {
      return b[1]["Total-Cases"] - a[1]["Total-Cases"];
    })
    .map((val, index) => {
      if (index < 10) {
        TotalConfirmed.push([val[0], val[1]["Total-Cases"]]);
      }
    });
    
  temp
    .sort((a, b) => {
      return b[1]["twoWeekTotal"] - a[1]["twoWeekTotal"];
    })
    .map((val, index) => {
      if (index < 10) {
        TwoWeekConfirmed.push([val[0], val[1]["twoWeekTotal"]]);
      }
    });

  // Returns top 10 vals in order
  return { TotalConfirmed: TotalConfirmed, TwoWeekConfirmed: TwoWeekConfirmed };

};

const filterTop10Deaths = (obj: any, feature?: any) => {
  const state = feature.properties.name;
  const excludeKeys = ["Unassigned", "TotalDeathsOverTime", "TotalNewDeaths"];
  const temp = [];
  //Total Deaths
  const TotalDeaths = [];
  //Two Week Deaths
  const TwoWeekDeaths = [];

  for (const county in obj[state]) {
    if (excludeKeys.indexOf(county) < 0) {
      temp.push([county, obj[state][county]]);
    }
  }

  temp
    .sort(function (a, b) {
      return b[1]["Total-Deaths"] - a[1]["Total-Deaths"];
    })
    .map((val, index) => {
      if (index < 10) {
        TotalDeaths.push([val[0], val[1]["Total-Deaths"]]);
      }
    });

  temp
    .sort((a, b) => {
      return b[1]["twoWeekDeathTotal"] - a[1]["twoWeekDeathTotal"];
    })
    .map((val, index) => {
      if (index < 10) {
        TwoWeekDeaths.push([val[0], val[1]["twoWeekDeathTotal"]]);
      }
    });

  return { TotalDeaths: TotalDeaths, TwoWeekDeaths: TwoWeekDeaths };
};

export const filterData = (
  confirmedArray?: any,
  deathsArray?: Array[],
  feature: any
): any => {
  const dates = filterDates();
  if (!!confirmedArray) {
    const filterState = filterForState(confirmedArray, undefined, feature);
    const filterCounty = filterForCounty(
      filterState,
      undefined,
      dates,
      feature
    );
    const filterTop = filterTop10(filterCounty, feature);
    return {
      filterState: filterState,
      filterCounty: filterCounty,
      top10: filterTop,
    };
  }
  if (!!deathsArray) {
    const filterStateDeaths = filterForState(undefined, deathsArray, feature);
    const filterCountyDeaths = filterForCounty(
      undefined,
      filterStateDeaths,
      dates,
      feature
    );
    const filterTop = filterTop10Deaths(filterCountyDeaths, feature);
    return {
      filterState: filterStateDeaths,
      filterCounty: filterCountyDeaths,
      top10: filterTop,
    };
  }
};
