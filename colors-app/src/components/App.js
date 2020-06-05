import React, { useState } from "react";
import ColorList from "./ColorList";
import Header from "./Header";
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
      numColors: 1,
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
      count: this.state.numColors,
      format: "hex",
    });

    if (this.state.colorList.length + newColor.length <= 5) {
      let colors = [...this.state.colorList, newColor];
      colors = colors.flat();
      this.setState({
        colorList: colors,
      });
    } else {
      let colors = [...this.state.colorList, newColor];
      colors = colors.flat();
      colors = colors.slice(0, 5);
      this.setState({
        colorList: colors,
      });
    }
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
        <Header />
        <div>
          <ColorList data={this.state} />
        </div>
        <div className="control-container">
          <label className="hue input-group">
            Enter Hue (Eg. Red or #e84643)
            <input
              type="text"
              value={this.state.hue}
              onChange={this.handleChange}
              name="hue"
              placeholder="Enter Hue Here"
              className="input"
            />
          </label>
          <label className="num-colors input-group">
            Enter Number Colors (1-5)
            <input
              type="number"
              name="numColors"
              value={this.state.numColors}
              placeholder="1"
              min="1"
              max="5"
              onChange={this.handleChange}
              className="input"
            />
          </label>
          <label className="button-group">
            Add Color
            <button className="button button-group" onClick={this.handleClick}>
              <FontAwesomeIcon icon={faPlusCircle} />
            </button>
          </label>
          <label className="button-group">
            Reset Colors
            <button className="button" onClick={this.handleRefresh}>
              <FontAwesomeIcon icon={faRedoAlt} />
            </button>
          </label>
        </div>
      </div>
    );
  }
}

export default App;
