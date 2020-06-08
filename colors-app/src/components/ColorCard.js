import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

function ColorCard(props) {
  const [toggle, toggleElement] = useState();
  return (
    <div className="color">
      <div
        className="color-section"
        style={{ backgroundColor: props.colorData }}
        onMouseOver={() => toggleElement(!toggle)}
        onMouseLeave={() => toggleElement(!toggle)}
      >
        {/* Color Part 
          Set BackgroundColor property to be the given color
        */}
        {toggle ? <FontAwesomeIcon icon={faCopy} size="3x" color="white" /> : null}
      </div>
      <div className="color-information">
        {/* Color Information */}
        <p>{props.namesData}</p>
        <p>{props.colorData}</p>
        <p></p>
      </div>
    </div>
  );
}

export default ColorCard;
