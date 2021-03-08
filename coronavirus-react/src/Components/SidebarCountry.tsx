import React, { useState, useEffect } from 'react';
import { FlexibleWidthXYPlot, ChartLabel, LineSeries, XAxis, YAxis, Crosshair } from 'react-vis';
import { countryAnalysis } from '../Data/FetchData';
import Overview from './Overview'


interface SidebarCountryProps {
  confirmedData: any;
  deathsData: any;
  usConfirmedTotal: number;
  usDeathsTotal: number;
}

const SidebarCountry = (props: SidebarCountryProps) => {
    const {
        usConfirmedTotal,
        usDeathsTotal,
        confirmedData,
        deathsData,
    } = props;
    
    const [countryConfirmed, setCountryConfirmed] = useState<any>(null);
    const [countryDeaths, setCountryDeaths] = useState<any>(null);

    const [confirmedPointsTotal, setConfirmedPointsTotal] = useState<any>([]);

    const [deathsPointsTotal, setDeathsPointsTotal] = useState<any>([]);
    
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

    const hasAllRequiredData = usConfirmedTotal &&
        usDeathsTotal &&
        countryConfirmed &&
        countryDeaths;

    return (
        !hasAllRequiredData ? null :
            (
              <>
                    <Overview name={'USA'} date={yesterday} confirmedTotal={usConfirmedTotal} deathsTotal={usDeathsTotal} />
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
           
    )
}

export default SidebarCountry;