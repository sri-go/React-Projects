import React from "react";

const Legend = () => {
  let colors = [
    { "0-10": "#FFEDA0" },
    { "10-20": "#FED976" },
    { "20-50": "#FEB24C" },
    { "50-100": "#FD8D3C" },
    { "100-200": "#FC4E2A" },
    { "200-500": "#E31A1C" },
    { "500-1000": "#BD0026" },
    { "1000+": "#800026" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: "30px",
        right: "30.5%",
        borderRadius: "5px",
        width: "200px",
        background: "rgb(152 146 143 / 0.5)",
        padding: "10px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1);",
      }}
    >
      {colors.map((color: any, index: number) => {
        const level = Object.keys(color);
        return (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <i
              key={index}
              style={{ width: "100px", background: color[level[0]] }}
            ></i>
            <span
              key={index}
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
      })}
    </div>
  );
};

export default Legend;
