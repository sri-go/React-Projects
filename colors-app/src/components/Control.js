import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faRedoAlt } from "@fortawesome/free-solid-svg-icons";

export default function Control(props) {
  //   console.log(props);
  const { data, onChange, onClick, onRefresh } = props;

  function handleChange(event) {
    onChange(event);
  }
  function handleClick() {
    onClick();
  }
  function handleRefresh(event) {
    onRefresh();
  }

  return (
    <div className="control-container">
      <label className="hue input-group">
        Enter Hue
        <input
          type="text"
          value={data.hue}
          onChange={handleChange}
          name="hue"
          placeholder="Eg. #e84643"
          className="input"
        />
      </label>
      <label className="num-colors input-group">
        Enter Number Colors (1-5)
        <input
          type="number"
          name="numColors"
          value={data.numColors}
          min="1"
          max="5"
          onChange={handleChange}
          className="input"
        />
      </label>
      <label className="select-scheme">
        Pick Color Scheme:
        <div className="select">
          <select value={data.colorScheme} onChange={handleChange} name="colorScheme">
            <option value=""></option>
            <option value="monochrome">Monochrome</option>
            <option value="monochrome-dark">Monochrome Dark</option>
            <option value="monochrome-light">Monochrome Light</option>
            <option value="analogic">Analogic</option>
            <option value="complement">Complement</option>
            <option value="analogic-complement">Analogic Complement</option>
            <option value="triad">Triad</option>
            <option value="quad">Quad</option>
          </select>
        </div>
      </label>
      <label className="button-group">
        Generate Color
        <button className="button button-group" onClick={handleClick}>
          <FontAwesomeIcon icon={faPlusCircle} />
        </button>
      </label>
      <label className="button-group">
        Refresh Colors
        <button className="button" onClick={handleRefresh}>
          <FontAwesomeIcon icon={faRedoAlt} />
        </button>
      </label>
    </div>
  );
}
