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

export default function Plot(props) {
  const { feature } = props;
  const [plotData, setPlotData] = useState(null);
  const [realData, setRealData] = useState([
    { x: 0, y: 8 },
    { x: 1, y: 5 },
    { x: 2, y: 4 },
    { x: 3, y: 9 },
    { x: 4, y: 1 },
    { x: 5, y: 7 },
    { x: 6, y: 6 },
    { x: 7, y: 3 },
    { x: 8, y: 2 },
    { x: 9, y: 0 },
  ]);

  useEffect(() => {
    const times_series = get_time_series(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"
    ).then((response) => {
      setPlotData(response);
      console.log(!!plotData);
    });
  }, []);

  useEffect(() => {
    test(feature);
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
    let obj = {};
    let top10 = {};
    let twoWeekData = [];
    // Returns 7-Day Data for each county, Top 10 Counties, and Sum of all cases per state

    array.map((element) => {
      const countyName = element.Admin2;
      obj[countyName] = {};
      let lastTwoWeeks = [];
      let totalCases = 0;
      const tempObj = {};
      const tempData = [];

      //[{Franklin: [data for 2 weeks], Adams: []....etc}]

      for (let key in element) {
        const value = {};
        // total cases for county is the last value in array
        if (key === datesArray[datesArray.length - 1]) {
          totalCases = totalCases + parseInt(element[key]);
        }
        if (excludeKeys.indexOf(key) < 0) {
          value.x = new Date(key);
          value.y = element[key];
          lastTwoWeeks.push(value);
        }
        // this is to retrieve the values of each day in the past 14 days
        if (datesArray.indexOf(key) >= 0) {
          //this is for plot of total cases over time
          // value.x = new Date(key);
          // value.y = element[key];
          // lastTwoWeeks.push(value);
          tempData.push(element[key]); //this is for total cases over the past 2 weeks
        }
      }
      tempObj[countyName] = tempData;
      twoWeekData.push(tempObj);

      // This is figuring out the difference between each days reported total cases
      //Will return the difference between each day in 2 week period
      const diff = tempObj[countyName]
        .slice(1)
        .map((value, index) => value - tempObj[countyName][index]);

      obj[countyName].totalCases = totalCases;
      obj[countyName].lastTwoWeeks = lastTwoWeeks;
    });

    console.log(obj);

    // on click use the states feature to display the plot for the state
    setRealData(obj["Franklin"].lastTwoWeeks);
    return obj;
  };

  const filterData = (array) => {
    const dates = filterDates(array);
    const filterState = filterForState(array);
    const filterCounty = filterForCounty(filterState, dates);
    return filterCounty;
  };

  const test = (feature) => {
    if (feature) {
      const x = filterData(plotData);
      console.log(x);
      // setRealData(x["Franklin,OH,US"].lastTwoWeeks);
    } else {
      return null;
    }
  };

  // calculate 2 weeks prior and update a subset of data to only have that ?
  return (
    <XYPlot xType="time" height={300} width={1000}>
      <HorizontalGridLines />
      {/* <VerticalGridLines /> */}
      <XAxis title="X Axis" />
      <YAxis title="Y Axis" />
      <LineSeries data={realData} />
    </XYPlot>
  );
}

//To Do
//fetch covid-19 times-series files (Deaths, Confirmed) -> Done
//go through data sort data for each state -> Done
//2 week filter based on current date -> Done

//currently have filtered data for every county in state
//need to filter down for top 10 counties in state-> show as a list (total cases, cases in last 7 days)
//calculate %change for 2 weeks -> show as a number
//calculate data for state per 2 week

//plots
//7 day average plot of new cases for state -> Moving Average (day + previous 6)
//7 day average plot of deaths for state
