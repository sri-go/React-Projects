import React from "react";

import Overview from './Overview'
import Table from "./Table"
import Chart from "./Chart";
interface SidebarProps {
  confirmedData: any;
  deathsData: any;
  feature: any;
  usConfirmedTotal: number;
  usDeathsTotal: number;
}

const Sidebar = ({ feature,
  confirmedData,
  deathsData}: SidebarProps) => {
 
  const yesterdaysDate = new Date();
  yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);

  return (
    <>
      {/* US Overview */}
      {/* To Do: Cleanup nested ternary -> breakout into subcomponent */}
      {!!feature && (
        <Overview name={feature.properties.name} date={yesterdaysDate} confirmedTotal={feature.properties.Confirmed} deathsTotal={feature.properties.Deaths} />
      )}
      {/* Per State Clicked */}
      {!!feature && (
        <>
          <hr />
          {/* To Do Add Time Series Deaths Total to Plot */}
          <Chart clickedFeature={feature} confirmedCaseData={confirmedData} deathsCaseData={deathsData} />
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
            <Table
              clickedFeature={feature}
              confirmedCaseData={confirmedData}
              deathsCaseData={deathsData}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
