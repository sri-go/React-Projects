import React from "react";

interface LegendProps {
  zoom: number;
}

const Legend = (props: LegendProps) => {
  const { zoom } = props;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "30px",
        right: "30.5%",
        borderRadius: "5px",
        width: "200px",
        background:
          zoom > 5.49 ? "rgb(122 120 119 / 50%)" : "rgb(152 146 143 / 0.5)",
        padding: "10px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1);",
      }}
    >
      {/* @ts-ignore */}
      {zoom > 5.49 ? <CountyLegend /> : <StateLegend />}
    </div>
  );
};

const CountyLegend = () => {
  const colorsCounty = [
    { 0: "#fff5f0" },
    { 50: "#fee0d2" },
    { 100: "#fcbba1" },
    { 500: "#fc9272" },
    { 1000: "#fb6a4a" },
    { 1500: "#ef3b2c" },
    { 2500: "#cb181d" },
    { 5000: "#99000d" },
  ];

  const legend = colorsCounty.map((color: any, index: number) => {
    const level = Object.keys(color);
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <i
          key={index}
          style={{ width: "100px", background: color[level[0]] }}
        ></i>
        <span
          style={{
            width: "100px",
            margin: "0 0 0 15px",
            textAlign: "left",
            color: "white",
          }}
        >
          {level[0]}
        </span>
      </div>
    )
  });
  return legend;
}

const StateLegend = () => {
let colorsState = [
  { "0-10": "#FFEDA0" },
  { "10-20": "#FED976" },
  { "20-50": "#FEB24C" },
  { "50-100": "#FD8D3C" },
  { "1000": "#FC4E2A" },
  { "5000": "#E31A1C" },
  { "10000": "#BD0026" },
  { "20000": "#800026" },
];
  const legend = colorsState.map((color: any, index: number) => {
    const level = Object.keys(color);
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <i
          key={index}
          style={{ width: "100px", background: color[level[0]] }}
        ></i>
        <span
          style={{
            width: "100px",
            margin: "0 0 0 15px",
            textAlign: "left",
            color: "white",
          }}
        >
          {level[0]}
        </span>
      </div>
    );
  });
  return legend;
}
export default Legend;
