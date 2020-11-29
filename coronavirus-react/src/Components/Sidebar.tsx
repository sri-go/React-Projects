import React, { useState, useEffect } from "react";
import {
  ChartLabel,
  Crosshair,
  FlexibleWidthXYPlot,
  LineSeries,
  XAxis,
  YAxis,
} from "react-vis";

import { filterData } from "../Data/FetchTimeSeries";

interface SidebarProps {
  timeSeriesData: any;
  feature: any;
  totalData: { usConfirmedTotal: number; usDeathTotal: number };
}

const Sidebar = (props: SidebarProps) => {
  const { feature, totalData, timeSeriesData } = props;

  const [pointsTotal, setPointsTotal] = useState<any>([]);
  const [pointsTwoWeek, setPointsTwoWeek] = useState<any>([]);

  const [TotalUSData, setTotalUSData] = useState<any>(null);

  const [filteredData, setFilteredData] = useState<any>(null);

  const [totalCases, setTotalCases] = useState<any>(null);
  const [totalNewCases, setTotalNewCases] = useState<any>(null);

  // set TotalUSData after fetching timeseries data
  useEffect(() => {
    setTotalUSData(totalData);
  }, [totalData]);

  // filter the fetched data once the state has been clicked
  // run everytime the feature changes
  // to do: distinguish between county clicks and state clicks
  useEffect(() => {
    let result;
    // do not filter unless there is a feature
    if (!!feature) {
      result = filterData(timeSeriesData, feature);
      console.log(result);
      setTotalCases(
        result.filterCounty[feature.properties.name].TotalCasesOverTime
      );
      setTotalNewCases(
        result.filterCounty[feature.properties.name].TotalNewCases
      );
    }
    return setFilteredData(result);
  }, [feature, timeSeriesData]);

  const date = new Date();

  return (
    <>
      {/* US Overview */}
      {/* To Do: Cleanup nested ternary -> breakout into subcomponent */}
      {!!feature ? (
        <>
          <div>
            <h1
              style={{
                margin: 0,
                color: "white",
                textAlign: "center",
                fontWeight: "normal",
                fontSize: "30px",
              }}
            >
              Coronavirus Situation for {feature.properties.name} as of
              {" " + date.toLocaleDateString("default")}
            </h1>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              textAlign: "center",
              margin: "10px 0 0 0",
            }}
          >
            <div style={{ border: "3px solid", borderRadius: "15px" }}>
              <h5 style={{ padding: "10px", margin: "0px", color: "white" }}>
                Total Confirmed Cases: <br />
                {feature.properties.Confirmed.toLocaleString()}
              </h5>
            </div>
            <div style={{ border: "3px solid", borderRadius: "15px" }}>
              <h5 style={{ padding: "10px", margin: "0px", color: "white" }}>
                Total Deaths: <br />
                {feature.properties.Deaths.toLocaleString()}
              </h5>
            </div>
          </div>
        </>
      ) : (
        !!TotalUSData && (
          <>
            <div>
              <h1
                style={{
                  margin: 0,
                  color: "white",
                  textAlign: "center",
                  fontWeight: "normal",
                  fontSize: "30px",
                }}
              >
                USA Coronavirus Situation as of{" "}
                {date.toLocaleDateString("default")}
              </h1>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                textAlign: "center",
                margin: "10px 0 0 0",
              }}
            >
              <div style={{ border: "3px solid", borderRadius: "15px" }}>
                <h5 style={{ padding: "10px", margin: "0px", color: "white" }}>
                  Total Confirmed Cases: <br />
                  {TotalUSData.us_confirmed_total.toLocaleString()}
                </h5>
              </div>
              <div style={{ border: "3px solid", borderRadius: "15px" }}>
                <h5 style={{ padding: "10px", margin: "0px", color: "white" }}>
                  Total Deaths: <br />
                  {TotalUSData.us_death_total.toLocaleString()}
                </h5>
              </div>
            </div>
          </>
        )
      )}
      {/* Per State Clicked */}
      {!!feature && (
        <>
          <hr />
          <div>
            {/* To Do Add Time Series Deaths Total to Plot */}
            <FlexibleWidthXYPlot
              xType="time"
              height={300}
              margin={{ top: 20, right: 20, left: 65 }}
              onMouseLeave={() => setPointsTotal([])}
            >
              <ChartLabel
                text="Total Number of Cases"
                includeMargin={false}
                xPercent={0.4}
                yPercent={0.1}
                style={{ fontSize: "30px" }}
              />
              <XAxis
                // @ts-ignore
                tickFormat={(t) => {
                  const d = new Date(t);
                  return d.toLocaleString("default", { month: "short" });
                }}
              />
              <YAxis title="Number of Cases" />
              <LineSeries
                data={totalCases}
                onNearestX={(v) => setPointsTotal([v])}
              />
              <Crosshair
                values={pointsTotal}
                itemsFormat={(d) => [{ title: "Total Cases", value: d[0].y }]}
                titleFormat={(d) => ({
                  title: "Date",
                  value: new Date(d[0].x).toLocaleDateString(),
                })}
              />
            </FlexibleWidthXYPlot>
          </div>
          <div>
            {/* To Do Add Time Series New Deaths to Plot */}
            <FlexibleWidthXYPlot
              xType="time"
              height={300}
              margin={{ top: 20, right: 20, left: 65 }}
              onMouseLeave={() => setPointsTwoWeek([])}
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
                onNearestX={(v) => setPointsTwoWeek([v])}
              />
              <Crosshair
                values={pointsTwoWeek}
                itemsFormat={(d) => [{ title: "New Cases", value: d[0].y }]}
                titleFormat={(d) => ({
                  title: "Date",
                  value: new Date(d[0].x).toLocaleDateString(),
                })}
              />
            </FlexibleWidthXYPlot>
          </div>
          <hr />
          <div style={{ backgroundColor: "#202020", overflow: "scroll" }}>
            <h2
              style={{
                fontFamily: "sans-serif",
                fontSize: "20px",
                fontWeight: "normal",
                margin: "10px 20px",
                textAlign: "center",
                color: "white",
              }}
            >
              Top 10 counties in {feature.properties.name}
            </h2>
            {!!filteredData && <Table data={filteredData.top10} />}
          </div>
        </>
      )}
    </>
  );
};

interface TableProps {
  data?: any;
}

// To Do: Add Deaths to Table (Top 10 Deaths for County, 2-Week Death Totals for County)
const Table = (props: TableProps) => {
  const { data } = props;
  const counties = Object.keys(data);

  return (
    <div style={{ margin: "0 20px", display: "flex" }}>
      <div>
        <div>
          <p>Top 10 Confirmed Count Total </p>
        </div>
        {counties.map((county, index) => {
          let backgroundColor;
          if (index % 2 === 0) {
            backgroundColor = "lightgrey";
          } else {
            backgroundColor = "white";
          }
          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                margin: "5px auto",
                padding: "5px",
                backgroundColor: backgroundColor,
                borderRadius: "10px",
                width: "65%",
                maxWidth: "600px",
              }}
            >
              <p
                style={{
                  margin: "0",
                  width: "200px",
                  textAlign: "left",
                  // borderRight: "2px solid",
                }}
              >
                {county}
              </p>
              <p style={{ margin: "0", width: "100px", textAlign: "center" }}>
                {data[county]}
              </p>
            </div>
          );
        })}
      </div>
      <div>
        <div>
          <p>Last Two Week Confirmed Count Totals </p>
        </div>
        {counties.map((county, index) => {
          let backgroundColor;
          if (index % 2 === 0) {
            backgroundColor = "lightgrey";
          } else {
            backgroundColor = "white";
          }
          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                margin: "5px auto",
                padding: "5px",
                backgroundColor: backgroundColor,
                borderRadius: "10px",
                width: "65%",
                maxWidth: "600px",
              }}
            >
              <p
                style={{
                  margin: "0",
                  width: "200px",
                  textAlign: "left",
                  // borderRight: "2px solid",
                }}
              >
                {county}
              </p>
              <p style={{ margin: "0", width: "100px", textAlign: "center" }}>
                {data[county]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
