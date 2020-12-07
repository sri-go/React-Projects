import React from "react";
interface LegendProps {
  zoom: number;
  legendStyle?: string;
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
      {zoom > 4.5 ? (
        <CountyLegend type={legendStyle} />
      ) : (
        <StateLegend type={legendStyle} />
      )}
    </div>
  );
};

const CountyLegend = (props: LegendStyleProps) => {
  const { type } = props;
 
  const colorsCounty = [
    { "0-100": "#FFE3C5" },
    { "100-500": "#F5BFA2" },
    { "500-1,000": "#E59E82" },
    { "1,000-5,000": "#D07E66" },
    { "5,000-10,000": "#B8614D" },
    { "10,000-50,000": "#9B4736" },
    { "50,000-75,000": "#7D2F23" },
    { "75,000-100,000": "#5C1A13" },
    { "100,000+": "#3C0902" },
  ];

  const colorsCountyTwoWeek = [
    { "0-50": "#c5f7ff" },
    { "50-100": "#ace0ec" },
    { "100-500": "#94cad9" },
    { "500-1,000": "#7cb4c6" },
    { "1,000-2,500": "#669eb4" },
    { "2,500-5,000": "#4f89a2" },
    { "5,000-10,000": "#397490" },
    { "10,000-15,000": "#21607e" },
    { "15,000+": "#004c6d" },
  ];

  const legend =
    type === "visible"
      ? colorsCounty.map((color: any, index: number) => {
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
      : colorsCountyTwoWeek.map((color: any, index: number) => {
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
};;

const StateLegend = (props: LegendStyleProps) => {
  const { type } = props;
  /**
   * FFE3C5
   *
   */
  let colorsStateTotal = [
    { "0-5,000": "#FFE3C5" },
    { "5,000-10,000": "#F5BFA2" },
    { "10,000-50,000": "#E59E82" },
    { "50,000-100,000": "#D07E66" },
    { "100,000-250,000": "#B8614D" },
    { "250,000-500,000": "#9B4736" },
    { "500,000-750,000": "#7D2F23" },
    { "750,000-1,000,000": "#5C1A13" },
    { "1,000,000+": "#3C0902" },
  ];

  let colorsStateTwoWeek = [
    { "0-500": "#c5f7ff" },
    { "500-1,000": "#ace0ec" },
    { "1,000-5,000": "#94cad9" },
    { "50,00-10,000": "#7cb4c6" },
    { "10,000-25,000": "#669eb4" },
    { "25,000-50,000": "#4f89a2" },
    { "50,000-100,000": "#397490" },
    { "100,000-250,000": "#21607e" },
    { "500,000+": "#004c6d" },
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
