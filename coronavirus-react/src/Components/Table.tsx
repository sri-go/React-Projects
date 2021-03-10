import React, { useState, useEffect } from 'react'
import { filterTimeSeriesData } from "../Data/AnalyzeTimeSeries";
interface TableProps {
  clickedFeature: any
  confirmedCaseData: any;
  deathsCaseData: any;
}

const Table = ({ clickedFeature, confirmedCaseData, deathsCaseData }: TableProps) => {
  const [filteredData, setFilteredData] = useState<any>(null);
  const [filteredDeathData, setFilteredDeathData] = useState<any>(null);

  // filter the fetched data once the state has been clicked
  // run everytime the feature changes
  useEffect(() => {
    let confirmedResult;
    let deathsResult;

    console.log(clickedFeature)
    confirmedResult = filterTimeSeriesData(confirmedCaseData, undefined, clickedFeature);
    deathsResult = filterTimeSeriesData(undefined, deathsCaseData, clickedFeature);

    setFilteredData(confirmedResult);
    setFilteredDeathData(deathsResult);
  }, [clickedFeature, confirmedCaseData, deathsCaseData]);

  console.log(filteredDeathData)

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
        {!!filteredData && filteredData['top10']['TotalConfirmed'].map((county: any, index: number) => {
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
          <p>14 Day Confirmed Case Total</p>
        </div>
        {!!filteredData && filteredData.top10["TwoWeekConfirmed"].map((county: any, index: number) => {
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
        {!!filteredDeathData && filteredDeathData.top10["TotalDeaths"].map((county: any, index: number) => {
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
        {!!filteredDeathData && filteredDeathData.top10["TwoWeekDeaths"].map((county: any, index: number) => {
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
  )
};

export default Table