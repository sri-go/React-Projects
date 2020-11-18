import { featureOf } from "@turf/turf";
import React, { useState, useEffect } from "react";
import {
  ChartLabel,
  FlexibleWidthXYPlot,
  FlexibleXYPlot,
  HorizontalGridLines,
  LineSeries,
  XAxis,
  XYPlot,
  YAxis,
} from "react-vis";
import { transform } from "typescript";
import {
  getTimeSeries,
  filterData,
  countryAnalysis,
} from "../Data/FetchTimeSeries";

interface SidebarProps {
  feature: any;
  totalData: { usConfirmedTotal: number; usDeathTotal: number };
}

const Sidebar = (props: SidebarProps) => {
  const { feature, totalData } = props;

  const [plotData, setPlotData] = useState(); // to do: rename variables to timeSeriesData, setTimeSeriesData

  // const [selectedState, setSelectedState] = useState();
  const [TotalUSData, setTotalUSData] = useState<any>(null);
  const [filteredData, setFilteredData] = useState<any>(null);

  const [totalCases, setTotalCases] = useState<any>(null);
  const [totalNewCases, setTotalNewCases] = useState<any>(null);

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

  // set TotalUSData after fetching timeseries data
  useEffect(() => {
    setTotalUSData(totalData);
  }, [totalData]);

  // filter the fetched data once the state has been clicked
  // run everytime the feature changes
  // to do: distinguish between county clicks and state clicks
  useEffect(() => {
    let result;
    console.log(feature);
    // do not filter unless there is a feature
    if (!!feature) {
      result = filterData(plotData, feature);
      console.log("current-filtered", result);
      setTotalCases(
        result.filterCounty[feature.properties.name].TotalCasesOverTime
      );
      setTotalNewCases(
        result.filterCounty[feature.properties.name].TotalNewCases
      );
      setFilteredData(result);
    }
    // console.log("previous-filtered", filteredData);
    return console.log(result);
    // return 
  }, [feature]);

  const top10Table = () => {
    const counties = Object.keys(filteredData.top10);
    console.log(counties)
    return counties.map((county, index) => {
      return <h4 key={index}>{filteredData.top10[county]}</h4>;
    });
  } 

  return (
    <>
      {/* US Overview */}
      {TotalUSData && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            textAlign: "center",
            margin: "10px 0 0 0",
          }}
        >
          <div style={{ border: "3px solid", borderRadius: "15px" }}>
            <h5 style={{ padding: "10px" }}>
              US Total Confirmed Cases: <br />
              {TotalUSData.us_confirmed_total}
            </h5>
          </div>
          <div style={{ border: "3px solid", borderRadius: "15px" }}>
            <h5 style={{ padding: "10px" }}>
              US Total Deaths: <br />
              {TotalUSData.us_death_total}
            </h5>
          </div>
        </div>
      )}
      {/* Per State Clicked */}
      {!!feature && (
        <>
          <div>
            <FlexibleWidthXYPlot
              xType="time"
              height={300}
              margin={{ top: 20, right: 20, left: 65 }}
            >
              <ChartLabel
                text="Total Number of Cases"
                includeMargin={false}
                xPercent={0.4}
                yPercent={0.1}
                style={{fontSize: '30px'}}
              />
              <XAxis
                // @ts-ignore
                tickFormat={(t) => {
                  const d = new Date(t);
                  return d.toLocaleString("default", { month: "short" });
                }}
              />
              <YAxis title="Number of Cases" />
              <LineSeries data={totalCases} />
            </FlexibleWidthXYPlot>
          </div>
          <div>
            <FlexibleWidthXYPlot
              xType="time"
              height={300}
              margin={{ top: 20, right: 20, left: 65 }}
            >
              <ChartLabel
                text="New Cases per Day"
                includeMargin={false}
                xPercent={0.4}
                yPercent={0.1}
                style={{ fontSize: "30px" }}
              />
              <XAxis
                on0
                // @ts-ignore
                tickFormat={(t) => {
                  const d = new Date(t);
                  return d.toLocaleString("default", { month: "short" });
                }}
              />
              <YAxis title="Number of Cases" />
              <LineSeries
                data={totalNewCases}
                curve={"curveMonotoneX"}
                style={{
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                }}
              />
            </FlexibleWidthXYPlot>
          </div>
          <div>
            {top10Table()}
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
