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
    const state = feature.properties.name;
    const obj = {};
    obj[state] = [];
    for (let key in array[0]) {
      let value = {};
      if (excludeKeys.indexOf(key) < 0) {
        value.x = new Date(key);
        value.y = 0;
        obj[state].push(value);
      }
    }
    array.map((county) => {
      let addV = [];
      for (let key in county) {
        if (excludeKeys.indexOf(key) < 0) {
          addV.push(parseInt(county[key]));
        }
      }
      obj[state].map((value, index) => {
        value.y = value.y + addV[index];
      });
    });
    setRealData(obj[state]);
    console.log(obj[state]);
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
