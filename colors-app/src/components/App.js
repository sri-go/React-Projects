import React, { useState } from "react";
import ColorList from "./ColorList";
import randomColor from "randomcolor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import "../styles/App.css";
import "react-bulma-components/dist/react-bulma-components.min.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      hue: "",
      numColors: null,
      colorList: [],
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  // This Captures the input color and sets it to state
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  }

  // This Captures the click event and generates a new color through randomColor function
  handleClick(event) {
    const newColor = randomColor({
      hue: this.state.hue,
      format: "hex",
    });
    this.state.colorList.length < 5 &&
      this.setState({
        colorList: [...this.state.colorList, newColor],
      });
  }

  //This resets state to an empty array
  handleRefresh(event) {
    this.setState({
      hue: "",
      colorList: [],
    });
  }

  render() {
    return (
      <div className="appContainer" style={{ backgroundColor: "whitesmoke" }}>
        {/* Generate Colors */}
        <div>
          <ColorList data={this.state.colorList} />
        </div>
        <div className="input-container">
          <input
            type="text"
            value={this.state.hue}
            onChange={this.handleChange}
            name="hue"
            placeholder="Enter Hue Here"
            className="input button-group"
          ></input>
          <button className="button button-group" onClick={this.handleClick}>
            <span>Add Color</span>
            <FontAwesomeIcon icon={faPlusCircle} />
          </button>
          {/* Restart Color Gen */}
          <button className="button button-group" onClick={this.handleRefresh}>
            <span>Reset Color</span>
            <FontAwesomeIcon icon={faRedoAlt} />
          </button>
        </div>
      </div>
    );
  }
}

export default App;
