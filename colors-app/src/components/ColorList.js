import React from "react";
import ColorCard from "./ColorCard";

function ColorList(props) {
  console.log(props);
  const colors = props.data.map((color, index) => {
    return (
      <ColorCard
        key={index}
        id={index}
        colorData={color}
        colorButtons={false}
      ></ColorCard>
    );
  });
  return <div className="colorCards">{colors}</div>;
}

export default ColorList;
