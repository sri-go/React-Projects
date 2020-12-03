import React from "react";
interface LegendProps {
  zoom: number;
  legendStyle?: any;
}
interface LegendStyleProps {
  type?: string; //to do: change to required, once county style is figured out
} 

const Legend = (props: LegendProps) => {
  const { zoom, legendStyle } = props;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "30px",
        right: "30.5%",
        borderRadius: "5px",
        width: "250px",
        background:
          zoom > 4.5 ? "rgb(122 120 119 / 50%)" : "rgb(152 146 143 / 0.5)",
        padding: "10px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      }}
    >
      {zoom > 4.5 ? <CountyLegend /> : <StateLegend type={legendStyle} />}
    </div>
  );
};

const CountyLegend = (props: LegendStyleProps) => {
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

  const colorsCountyTwoWeek = [];

  const legend = colorsCounty.map((color: any, index: number) => {
    const level = Object.keys(color);
    return (
      <div
        key={index}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <i style={{ width: "100px", background: color[level[0]] }} />
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

  return <>{legend}</>;
};

const StateLegend = (props: LegendStyleProps) => {
  const { type } = props;
  
  let colorsStateTotal = [
    { "0-1000": "#FFE3C5" },
    { "1000-5000": "#F9C6A8" },
    { "5000-10000": "#EFAA8E" },
    { "10000-25000": "#E28F75" },
    { "25000-50000": "#D0765F" },
    { "50000-100000": "#BC5E4B" },
    { "100000-250000": "#A64839" },
    { "250000-500000": "#8E3429" },
    { "500000-750000": "#74221B" },
    { "750000-1000000": "#59120F"  },
    { "1000000+": "#3F0501" },
  ];

  let colorsStateTwoWeek = [
    { "0-1000": "#FCDDC0" },
    { "1000-5000": "#E29A80" },
    { "5000-10000": "#CE7B64" },
    { "10000-25000": "#B65F4C" },
    { "25000-50000": "#9A4536" },
    { "50000-100000": "#7C2E24" },
    { "100000-250000": "#5D1A14" },
    { "500000+": "#3D0903" },
  ];

  const legend =
    type === "visible"
      ? colorsStateTotal.map((color: any, index: number) => {
          const level = Object.keys(color);
          return (
            <div
              key={index}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <i style={{ width: "100px", background: color[level[0]] }} />
              <span
                style={{
                  width: "200px",
                  margin: "0 0 0 15px",
                  textAlign: "left",
                  color: "white",
                }}
              >
                {level[0]}
              </span>
            </div>
          );
        })
      : colorsStateTwoWeek.map((color: any, index: number) => {
          const level = Object.keys(color);
          return (
            <div
              key={index}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <i style={{ width: "100px", background: color[level[0]] }} />
              <span
                style={{
                  width: "200px",
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
  return <>{legend}</>;
};

export default Legend;
