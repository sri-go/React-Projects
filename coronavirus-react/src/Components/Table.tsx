import React from 'react'

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

export default Table