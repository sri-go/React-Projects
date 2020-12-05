import React, { useState, useEffect } from "react";
import {
  ChartLabel,
  Crosshair,
  FlexibleWidthXYPlot,
  LineSeries,
  XAxis,
  YAxis,
} from "react-vis";

import { filterData } from "../Data/AnalyzeTimeSeries";

interface SidebarProps {
  confirmedData: any;
  deathsData: any;
  feature: any;
  usConfirmedTotal: number;
  usDeathsTotal: number;
}

const Sidebar = (props: SidebarProps) => {
  const {
    feature,
    usConfirmedTotal,
    usDeathsTotal,
    confirmedData,
    deathsData,
  } = props;

  const [confirmedPointsTotal, setConfirmedPointsTotal] = useState<any>([]);
  const [confirmedPointsTwoWeek, setConfirmedPointsTwoWeek] = useState<any>([]);

  const [deathsPointsTotal, setDeathsPointsTotal] = useState<any>([]);
  const [deathsPointsTwoWeek, setDeathsPointsTwoWeek] = useState<any>([]);

  const [filteredData, setFilteredData] = useState<any>(null);
  const [filteredDeathData, setFilteredDeathData] = useState<any>(null);

  const [totalCases, setTotalCases] = useState<any>(null);
  const [totalNewCases, setTotalNewCases] = useState<any>(null);

  const [totalDeaths, setTotalDeaths] = useState<any>(null);
  const [totalNewDeaths, setTotalNewDeaths] = useState<any>(null);

  // filter the fetched data once the state has been clicked
  // run everytime the feature changes
  // to do: distinguish between county clicks and state clicks
  useEffect(() => {
    let confirmedResult;
    let deathsResult;
    // do not filter unless there is a feature
    if (!!feature) {
      confirmedResult = filterData(confirmedData, undefined, feature);
      deathsResult = filterData(undefined, deathsData, feature);
      setTotalCases(
        confirmedResult.filterCounty[feature.properties.name].TotalCasesOverTime
      );
      setTotalDeaths(
        deathsResult.filterCounty[feature.properties.name].TotalDeathsOverTime
      );
      setTotalNewCases(
        confirmedResult.filterCounty[feature.properties.name].TotalNewCases
      );
      setTotalNewDeaths(
        deathsResult.filterCounty[feature.properties.name].TotalNewDeaths
      );
    }
    setFilteredData(confirmedResult);
    setFilteredDeathData(deathsResult);
  }, [feature, confirmedData]);

  const date = new Date();

  return (
    <>
      {/* US Overview */}
      {/* To Do: Cleanup nested ternary -> breakout into subcomponent */}
      {!!feature ? (
        <div
          style={{
            position: "sticky",
            top: "0",
            backgroundColor: "rgb(29 29 29)",
            zIndex: 5,
          }}
        >
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
        </div>
      ) : (
        usConfirmedTotal & usDeathsTotal && (
          <div>
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
                  {usConfirmedTotal.toLocaleString()}
                </h5>
              </div>
              <div style={{ border: "3px solid", borderRadius: "15px" }}>
                <h5 style={{ padding: "10px", margin: "0px", color: "white" }}>
                  Total Deaths: <br />
                  {usDeathsTotal.toLocaleString()}
                </h5>
              </div>
            </div>
          </div>
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
              onMouseLeave={(e) => {
                setConfirmedPointsTotal([]);
                setDeathsPointsTotal([]);
              }}
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
                className="first-series"
                data={totalCases}
                onNearestX={(v) => {
                  setConfirmedPointsTotal([v]);
                }}
              />
              <LineSeries
                className="second-series"
                data={totalDeaths}
                onNearestX={(v) => {
                  setDeathsPointsTotal([v]);
                }}
              />
              {deathsPointsTotal.length > 0 && (
                <Crosshair values={deathsPointsTotal}>
                  <div
                    style={{
                      width: "150px",
                      padding: "10px",
                      background: "black",
                    }}
                  >
                    <h3 style={{ margin: "0 0 10px 0" }}>
                      {deathsPointsTotal[0].x.toLocaleDateString("en-us")}
                    </h3>
                    <p style={{ margin: "0" }}>
                      Total Cases: {confirmedPointsTotal[0].y}
                    </p>
                    <p style={{ margin: "10px 0 0 0" }}>
                      Total Deaths: {deathsPointsTotal[0].y}
                    </p>
                  </div>
                </Crosshair>
              )}
            </FlexibleWidthXYPlot>
          </div>
          <div>
            {/* To Do Add Time Series New Deaths to Plot */}
            <FlexibleWidthXYPlot
              xType="time"
              height={300}
              margin={{ top: 20, right: 20, left: 65 }}
              onMouseLeave={() => {
                setConfirmedPointsTwoWeek([]);
                setDeathsPointsTwoWeek([]);
              }}
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
                onNearestX={(v) => setConfirmedPointsTwoWeek([v])}
              />
              <LineSeries
                data={totalNewDeaths}
                curve={"curveMonotoneX"}
                style={{
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                }}
                onNearestX={(v) => setDeathsPointsTwoWeek([v])}
              />
              {confirmedPointsTwoWeek.length > 0 && (
                <Crosshair values={confirmedPointsTwoWeek}>
                  <div
                    style={{
                      width: "150px",
                      padding: "10px",
                      background: "black",
                    }}
                  >
                    <h3 style={{ margin: "0 0 10px 0" }}>
                      {confirmedPointsTwoWeek[0].x.toLocaleDateString("en-us")}
                    </h3>
                    <p style={{ margin: "0" }}>
                      Two Week Total Cases: {confirmedPointsTwoWeek[0].y}
                    </p>
                    <p style={{ margin: "10px 0 0 0" }}>
                      Two Week Total Deaths: {deathsPointsTwoWeek[0].y}
                    </p>
                  </div>
                </Crosshair>
              )}
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
