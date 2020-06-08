import React from "react";
import ColorCard from "./ColorCard";

function ColorList(props) {
  let { colorList } = props.data;
  const colors = colorList.map((color, index) => {
    return (
      <ColorCard
        key={index}
        id={index}
        colorData={color.hex}
        namesData={color.name}
        colorButtons={false}
      ></ColorCard>
    );
  });
  return <div className="colorCards">{colors}</div>;
}

export default ColorList;
