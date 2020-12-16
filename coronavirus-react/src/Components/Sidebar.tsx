import React, { useState, useEffect } from "react";
import {
  ChartLabel,
  Crosshair,
  FlexibleWidthXYPlot,
  LineSeries,
  XAxis,
  YAxis,
  DiscreteColorLegend,
} from "react-vis";

import StateBoundaries from "../Data/StateBoundaries.json";

import { countryAnalysis } from "../Data/FetchData";
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

  const [countryConfirmed, setCountryConfirmed] = useState<any>(null);
  const [countryDeaths, setCountryDeaths] = useState<any>(null);

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

  useEffect(() => {
    const confirmed = countryAnalysis(confirmedData, undefined);
    setCountryConfirmed(confirmed);
    const deaths = countryAnalysis(undefined, deathsData);
    setCountryDeaths(deaths);
  }, [deathsData, confirmedData]);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const scaleData = (data?: any) => {
    if (!!data) {
      const finalVal = data.slice(-1);
      return [0, finalVal[0].y];
    }
  };

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
          <div style={{ margin: "0px auto", maxWidth: "350px", width: "100%" }}>
            <h1
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "normal",
                fontSize: "30px",
                marginTop: "0px",
              }}
            >
              Coronavirus Situation for {feature.properties.name} as of
              {" " + yesterday.toLocaleDateString("default")}
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
        usConfirmedTotal &&
        usDeathsTotal &&
        countryConfirmed &&
        countryDeaths && (
          <>
            <div>
              <div
                style={{ margin: "0px auto", maxWidth: "350px", width: "100%" }}
              >
                <h1
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "normal",
                    fontSize: "30px",
                    marginTop: "0px",
                  }}
                >
                  USA Coronavirus Situation as of{" "}
                  {yesterday.toLocaleDateString("default")}
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
                  <h5
                    style={{ padding: "10px", margin: "0px", color: "white" }}
                  >
                    Total Confirmed Cases: <br />
                    {usConfirmedTotal.toLocaleString()}
                  </h5>
                </div>
                <div style={{ border: "3px solid", borderRadius: "15px" }}>
                  <h5
                    style={{ padding: "10px", margin: "0px", color: "white" }}
                  >
                    Total Deaths: <br />
                    {usDeathsTotal.toLocaleString()}
                  </h5>
                </div>
              </div>
            </div>
            <hr />
            <div>
              <FlexibleWidthXYPlot
                height={300}
                margin={{ top: 20, right: 20, left: 100 }}
                onMouseLeave={(e) => {
                  setConfirmedPointsTotal([]);
                  setDeathsPointsTotal([]);
                }}
              >
                <ChartLabel
                  text="Total Number of Cases in USA"
                  includeMargin={false}
                  xPercent={0.4}
                  yPercent={0.1}
                  style={{ fontSize: "30px" }}
                />
                <LineSeries
                  className="first-series"
                  data={countryConfirmed}
                  onNearestX={(v) => {
                    setConfirmedPointsTotal([v]);
                  }}
                  yDomain={scaleData(countryConfirmed)}
                />
                <LineSeries
                  className="second-series"
                  data={countryDeaths}
                  onNearestX={(v) => {
                    setDeathsPointsTotal([v]);
                  }}
                  yDomain={scaleData(countryDeaths)}
                />
                <XAxis
                  tickFormat={(t) => {
                    const d = new Date(t);
                    return d.toLocaleString("default", { month: "short" });
                  }}
                />
                <YAxis
                  orientation="left"
                  title="Number of Cases"
                  tickPadding={10}
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
                        Total Cases:{" "}
                        {confirmedPointsTotal[0].y.toLocaleString()}
                      </p>
                      <p style={{ margin: "10px 0 0 0" }}>
                        Total Deaths: {deathsPointsTotal[0].y.toLocaleString()}
                      </p>
                    </div>
                  </Crosshair>
                )}
              </FlexibleWidthXYPlot>
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
                yDomain={scaleData(totalCases)}
              />
              <LineSeries
                className="second-series"
                data={totalDeaths}
                onNearestX={(v) => {
                  setDeathsPointsTotal([v]);
                }}
                yDomain={scaleData(totalDeaths)}
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
                // yDomain={scaleData(totalNewCases)}
              />
              <LineSeries
                data={totalNewDeaths}
                curve={"curveMonotoneX"}
                style={{
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                }}
                onNearestX={(v) => setDeathsPointsTwoWeek([v])}
                // yDomain={[0, 100]}
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
          <div
            style={{
              backgroundColor: "#202020",
              overflow: "scroll",
              padding: "20px",
            }}
          >
            <h2
              style={{
                fontFamily: "sans-serif",
                fontSize: "20px",
                fontWeight: "normal",
                margin: "10px 20px",
                textAlign: "center",
                color: "white",
                width: "1000px",
              }}
            >
              Top 10 counties in {feature.properties.name}
            </h2>
            {!!filteredData && (
              <Table
                confirmedData={filteredData}
                deathsData={filteredDeathData}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

interface TableProps {
  confirmedData?: any;
  deathsData?: any;
}

const Table = (props: TableProps) => {
  const { confirmedData, deathsData } = props;
  const countiesTotalConfirmed = confirmedData.top10["TotalConfirmed"];
  const countiesTwoWeek = confirmedData.top10["TwoWeekConfirmed"];

  const countiesTotalDeaths = deathsData.top10["TotalDeaths"];
  const countiesTwoWeekDeaths = deathsData.top10["TwoWeekDeaths"];

  return (
    <div
      style={{
        margin: "10px auto",
        display: "flex",
        width: "1000px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "300px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            margin: "0 auto",
            width: "200px",
            color: "white",
          }}
        >
          <p>Cumulative Confirmed Case Totals</p>
        </div>
        {countiesTotalConfirmed.map((county: any, index: number) => {
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
                maxWidth: "200px",
              }}
            >
              <p
                style={{
                  margin: "0 5px",
                  width: "100px",
                  textAlign: "left",
                }}
              >
                {county[0]}
              </p>
              <p style={{ margin: "0", width: "75px", textAlign: "center" }}>
                {county[1]}
              </p>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "300px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            margin: "0 auto",
            width: "200px",
            color: "white",
          }}
        >
          <p>Cumulative Confirmed Deaths Total</p>
        </div>
        {countiesTotalDeaths.map((county: any, index: number) => {
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
                maxWidth: "200px",
              }}
            >
              <p
                style={{
                  margin: "0 5px",
                  width: "100px",
                  textAlign: "left",
                }}
              >
                {county[0]}
              </p>
              <p style={{ margin: "0", width: "75px", textAlign: "center" }}>
                {county[1]}
              </p>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "300px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            margin: "0 auto",
            width: "200px",
            color: "white",
          }}
        >
          <p>14 Day Confirmed Case Totals</p>
        </div>
        {countiesTwoWeek.map((county: any, index: number) => {
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
                maxWidth: "200px",
              }}
            >
              <p
                style={{
                  margin: "0 5px",
                  width: "100px",
                  textAlign: "left",
                }}
              >
                {county[0]}
              </p>
              <p style={{ margin: "0", width: "75px", textAlign: "center" }}>
                {county[1]}
              </p>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "300px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            margin: "0 auto",
            width: "200px",
            color: "white",
          }}
        >
          <p>14 Day Confirmed Deaths Total</p>
        </div>
        {countiesTwoWeekDeaths.map((county: any, index: number) => {
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
                maxWidth: "200px",
              }}
            >
              <p
                style={{
                  margin: "0 5px",
                  width: "100px",
                  textAlign: "left",
                }}
              >
                {county[0]}
              </p>
              <p style={{ margin: "0", width: "75px", textAlign: "center" }}>
                {county[1]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
