import React, { useState, useEffect } from "react";
import {
  HorizontalGridLines,
  LineSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from "react-vis";
import {
  getTimeSeries,
  filterData,
  countryAnalysis,
} from "../Data/FetchTimeSeries";

interface SidebarProps {
  data: any;
  totalData: { usConfirmedTotal: number; usDeathTotal: number };
}

const Sidebar = (props: SidebarProps) => {
  const { data, totalData } = props;

  const [plotData, setPlotData] = useState(); // to do: rename variables to timeSeriesData, setTimeSeriesData

  const [selectedState, setSelectedState] = useState();
  const [filteredData, setFilteredData] = useState<any>();
  const [TotalUSData, setTotalUSData] = useState<any>(null);

  const [totalCases, setTotalCases] = useState();
  const [totalNewCases, setTotalNewCases] = useState();

  // fetch data on component load
  useEffect(() => {
    const getData = getTimeSeries(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"
    );
    getData.then((response) => {
      setPlotData(response); // set the timeseries data after feth
      countryAnalysis(response); // to do: analysis of us as a whole
    });
  }, []);

  // set TotalUSData after fetching
  useEffect(() => {
    setTotalUSData(totalData);
  }, [totalData]);

  // filter the fetched data once the state has been clicked
  useEffect(() => {
    if (!!data) {
      const result = filterData(plotData, data); // on click, filter the fetched data for the selected state
      setFilteredData(result);
    }
  }, [data]);

  return (
    <>
      {/* US Overview */}
      {TotalUSData && (
        <div>
          US Total Confirmed Cases: {TotalUSData.us_confirmed_total}
          <br />
          US Total Deaths: {TotalUSData.us_death_total}
        </div>
      )}
      {/* Per State Clicked */}
      {filteredData && (
        <XYPlot xType="time" height={300} width={500}>
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis title="X Axis" />
          <YAxis title="Y Axis" />
          <LineSeries
            data={
              filteredData.filterCounty[data.properties.name].TotalCasesOverTime
            }
          />
          {/* <LineSeries data={totalCases} /> */}
        </XYPlot>
      )}
    </>
  );
};

export default Sidebar;
