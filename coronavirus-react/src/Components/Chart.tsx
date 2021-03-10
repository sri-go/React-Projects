import React, { useState, useEffect } from 'react'
import { FlexibleWidthXYPlot, ChartLabel, XAxis, YAxis, LineSeries, Crosshair } from 'react-vis';

import { filterTimeSeriesData } from "../Data/AnalyzeTimeSeries";

interface ChartProps {
    clickedFeature: any,
    confirmedCaseData: any,
    deathsCaseData: any
}

const Chart = ({ clickedFeature, confirmedCaseData, deathsCaseData }: ChartProps) => {
    const [totalCases, setTotalCases] = useState<any>(null);
    const [totalNewCases, setTotalNewCases] = useState<any>(null);

    const [totalDeaths, setTotalDeaths] = useState<any>(null);
    const [totalNewDeaths, setTotalNewDeaths] = useState<any>(null);

    const [deathsPointsTotal, setDeathsPointsTotal] = useState<any>([]);
    const [deathsPointsTwoWeek, setDeathsPointsTwoWeek] = useState<any>([]);

    const [confirmedPointsTotal, setConfirmedPointsTotal] = useState<any>([]);
    const [confirmedPointsTwoWeek, setConfirmedPointsTwoWeek] = useState<any>([]);

    useEffect(() => {
        let confirmedResult;
        let deathsResult;
        // do not filter unless there is a feature
        if (!!clickedFeature) {
            confirmedResult = filterTimeSeriesData(confirmedCaseData, undefined, clickedFeature);
            deathsResult = filterTimeSeriesData(undefined, deathsCaseData, clickedFeature);
            setTotalCases(
                confirmedResult.filterCounty[clickedFeature.properties.name].TotalCasesOverTime
            );
            setTotalDeaths(
                deathsResult.filterCounty[clickedFeature.properties.name].TotalDeathsOverTime
            );
            setTotalNewCases(
                confirmedResult.filterCounty[clickedFeature.properties.name].TotalNewCases
            );
            setTotalNewDeaths(
                deathsResult.filterCounty[clickedFeature.properties.name].TotalNewDeaths
            );
        }

    }, [clickedFeature, confirmedCaseData]);

    const scaleData = (data?: any) => {
        if (!!data) {
            const finalVal = data.slice(-1);
            return [0, finalVal[0].y];
        }
    };

    const scaleData2 = (data?: any) => {
        let max = 0;
        let arrIndex = 0;
        if (!!data) {
            console.log(data);
            data.map((index: number, val: any) => {
                if (val.y >= max) {
                    max = val.y
                    arrIndex = index
                }
            })
            console.log('max', max)
            console.log(data[arrIndex])
            return [0, max]
        }
    }

    return (
        <>
            <div>
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
                            strokeWidth: 2
                        }}
                        onNearestX={(v) => setConfirmedPointsTwoWeek([v])}
                        // yDomain={scaleData2(totalNewCases)}
                    />
                    <LineSeries
                        data={totalNewDeaths}
                        curve={"curveMonotoneX"}
                        style={{
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                        }}
                        onNearestX={(v) => setDeathsPointsTwoWeek([v])}
                        // yDomain={scaleData2(totalNewDeaths)}
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
        </>
    )
}

export default Chart;