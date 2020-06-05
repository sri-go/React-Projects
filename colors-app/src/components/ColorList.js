import React from "react";
import ColorCard from "./ColorCard";

function ColorList(props) {
  // console.log(props);
  let { colorList, hue } = props.data;
  // flatten array list to one array
  colorList = colorList.flat();
  const colors = colorList.map((color, index) => {
    // console.log(color);
    // return color card
    return <ColorCard key={index} id={index} colorData={color} colorButtons={false}></ColorCard>;
  });
  return <div className="colorCards">{colors}</div>;
}

export default ColorList;
