import React, { useState, useEffect } from "react";
import {
  XYPlot,
  HorizontalGridLines,
  XAxis,
  YAxis,
  LineSeries,
} from "react-vis";
import { get_time_series } from "../Data/FetchData";
import "../../node_modules/react-vis/dist/style.css";
import { rest } from "underscore";

export default function Plot(props) {
  const { feature } = props;
  const [plotData, setPlotData] = useState(null);
  const [totalCases, setTotalCases] = useState(null);
  const [totalNewCases, setTotalNewCases] = useState(null);

  useEffect(() => {
    const times_series = get_time_series(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"
    ).then((response) => {
      setPlotData(response);
      console.log(!!plotData);
    });
  }, []);

  useEffect(() => {
    result(feature);
  }, [feature]);

  const filterDates = () => {
    //Filtering by date, I want to only get the data for
    //the past 2 weeks
    const date = new Date();
    date.setDate(date.getDate() - 16);
    //creating a new array of keys that I want to select in the objs
    let newDates = [];
    for (let i = 0; i < 15; i++) {
      date.setDate(date.getDate() + 1);
      newDates.push(date.toLocaleDateString("en-us", { dateStyle: "short" }));
    }
    return newDates;
  };

  const filterForState = (array) => {
    let temp = [];
    array.map((element) => {
      //find the values for the selected state from raw data
      //if the element matches the selected feature begin further filtering
      if (element.Province_State === feature.properties.name) {
        temp.push(element);
      }
    });
    return temp;
  };

  const filterForCounty = (array, datesArray) => {
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
    const state = feature.properties.name;
    const obj = {};
    obj[state] = {};
    obj[state]["TotalCasesOverTime"] = []; //For State
    obj[state]["TotalNewCases"] = []; //For State
    obj[state]["DailyChangeKeys"] = []; //Temp
    obj[state]["NewCases"] = []; //Temp
    //Create an initial object with the state and an array as its value
    //Initialize the array with values of dates as the x and y value as 0
    for (let key in array[0]) {
      let value = {};
      let other_value = {};
      if (excludeKeys.indexOf(key) < 0) {
        obj[state]["TotalNewCases"].push(other_value);
        value.x = new Date(key);
        value.y = 0;
        obj[state]["TotalCasesOverTime"].push(value);
        obj[state]["DailyChangeKeys"].push(key);
      }
    }
    // console.log(1, temp);
    //Loop through array and push value to a temp array
    //Loop through final object array and add the temp value at the correct date to it
    array.map((county, index) => {
      const tempArray = []; //This is temporary to hold values of each county
      const countyName = county.Admin2;
      obj[state][countyName] = {}; //Create a new object for each county

      const tempdailyChange = []; //Array holds daily change val for each county

      let totalCases = 0; //This will be the final value for each county
      let twoWeekTotal = 0; //This will be the difference between last val and 13day val

      for (let key in county) {
        if (key === datesArray[datesArray.length - 1]) {
          totalCases = totalCases + parseInt(county[key]);
          obj[state][countyName]["Total-Cases"] = totalCases;
        }

        //Calculate difference between values for each county
        if (excludeKeys.indexOf(key) < 0) {
          const { DailyChangeKeys } = obj[state];

          //Calculate Diff
          let diff =
            parseInt(
              county[DailyChangeKeys[DailyChangeKeys.indexOf(key) + 1]]
            ) - parseInt(county[key]);

          //Add to Temp Array
          tempdailyChange.push({ x: new Date(key), y: diff });
        }

        // Total Cases Over Time
        if (excludeKeys.indexOf(key) < 0) {
          tempArray.push(parseInt(county[key]));
        }
      }

      // Daily Change in Cases Over Time For County -> Every value except last, which is "NaN"
      obj[state][countyName]["NewCases"] = tempdailyChange.slice(
        0,
        tempdailyChange.length - 1
      );

      //Daily New Cases For State
      obj[state][countyName]["NewCases"].forEach((value, index) => {
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
      twoWeekTotal =
        county[datesArray[datesArray.length - 1]] - county[datesArray[0]];
      obj[state][countyName].twoWeekTotal = twoWeekTotal;

      // Total Cases Over Time For State
      obj[state]["TotalCasesOverTime"].map((value, index) => {
        value.y = value.y + tempArray[index];
      });
    });

    // Remove last value, "NaN" in Total New Cases for State
    obj[state]["TotalNewCases"] = obj[state]["TotalNewCases"].slice(
      0,
      obj[state]["TotalNewCases"].length - 1
    );

    setTotalCases(obj[state]["TotalCasesOverTime"]);
    setTotalNewCases(obj[state]["TotalNewCases"]);
    delete obj[state]["DailyChangeKeys"];
    delete obj[state]["NewCases"];
    return obj;
  };

  const filterTop10 = (obj) => {
    console.log(obj);
    const state = feature.properties.name;
    const excludeKeys = ["TotalCasesOverTime", "TotalNewCases"];
    const keys = Object.keys(obj[state]);
    const top10 = [];
    const countyNames = [];

    //empty table if it has values
    let element = document.getElementById("table");
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }

    // loop through all counties and add to county array
    for (const county in obj[state]) {
      if (excludeKeys.indexOf(county) < 0) {
        top10.push(obj[state][county]["Total-Cases"]);
      }
    }
    // Returns top 10 vals in order
    const topValues = top10.sort((a, b) => b - a).slice(0, 10);
    console.log(topValues);

    for (const county in obj[state]) {
      // check if value is in top values
      if (topValues.indexOf(obj[state][county]["Total-Cases"]) > 0) {
        countyNames.push(county);
      }
    }
    console.log(countyNames);

    // Initialize Table
    const tableElement = document.getElementById("table");
    const body = document.createElement("tbody");
    tableElement.style.padding = "20px";

    const labelsContainer = document.createElement("thead");
    const rowLabels = document.createElement("tr");
    const countyLabel = document.createElement("th");
    const casesLabel = document.createElement("th");

    casesLabel.style.padding = "0 10px";
    casesLabel.style.textAlign = "center";
    countyLabel.style.padding = "0 10px 0 0";
    countyLabel.style.textAlign = "left";

    casesLabel.innerHTML = "Total Cases";
    countyLabel.innerHTML = "County Name";
    labelsContainer.appendChild(rowLabels);
    rowLabels.appendChild(countyLabel);
    rowLabels.appendChild(casesLabel);
    tableElement.appendChild(labelsContainer);

    topValues.map((val, index) => {
      // Create table names if not exist
      const row = document.createElement("tr");
      const cases = document.createElement("td");
      const countyName = document.createElement("td");
      const value = document.createElement("span");

      row.style.borderTop = "1px solid rgba(0, 0, 0, 0.1)";
      cases.style.padding = "10px 5px";

      value.innerHTML = `${val}`;
      cases.appendChild(value);
      row.appendChild(countyName);
      row.appendChild(cases);
      body.appendChild(row);
      tableElement.appendChild(body);
    });

    return topValues;
  };

  const filterData = (array) => {
    const dates = filterDates(array);
    const filterState = filterForState(array);
    const filterCounty = filterForCounty(filterState, dates);
    const top10 = filterTop10(filterCounty);
  };

  const result = (feature) => {
    if (feature) {
      const result = filterData(plotData);
    } else {
      return console.log(`error, ${feature} not found`);
    }
  };

  // calculate 2 weeks prior and update a subset of data to only have that ?
  return (
    <>
      {feature && (
        <h1 style={{ zIndex: 100, color: "red" }}>Total Cases Over Time</h1>
      )}
      <div>
        <XYPlot xType="time" height={300} width={500}>
          <HorizontalGridLines />
          {/* <VerticalGridLines /> */}
          <XAxis title="X Axis" position="middle" />
          <YAxis title="Y Axis" position="middle" />
          <LineSeries data={totalNewCases} />
          <LineSeries data={totalCases} />
        </XYPlot>
      </div>
      {feature && (
        <div>
          <table>
            <tbody id="table"></tbody>
          </table>
        </div>
      )}
    </>
  );
}
