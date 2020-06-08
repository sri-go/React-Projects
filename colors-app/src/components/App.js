import React, { useState } from "react";
import ColorList from "./ColorList";
import Header from "./Header";
import Control from "./Control";
import randomColor from "randomcolor";
import "../styles/App.css";
import "react-bulma-components/dist/react-bulma-components.min.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      hue: "",
      colorScheme: "",
      numColors: 5,
      colorList: [],
      nameList: [],
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    const myInit = {
      method: "GET",
      mode: "cors",
      cache: "default",
    };
    const newColor = randomColor();
    let color = newColor.split("#");
    color = color[1];
    console.log(color);

    //Transmit to Color API and return initial list of colors in monochrome scheme
    fetch(`https://www.thecolorapi.com/scheme?hex=${color}&count=${this.state.numColors}`, myInit)
      .then((response) => response.json())
      .then((response) => {
        let colors = response.colors;
        return colors.map((color) => {
          let hex = color.hex.value;
          let name = color.name.value;
          color = {
            name: name,
            hex: hex,
          };
          return color;
        });
      })
      .then((response) => {
        this.setState({
          colorList: response,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // This Captures the input color and sets it to state
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  }
  // This Captures the click event and generates a new color through randomColor function
  handleClick() {
    //Generate new color
    const newColor = randomColor({
      hue: "#" + this.state.hue,
      count: this.state.numColors,
      format: "hex",
    });
    const myInit = {
      method: "GET",
      mode: "cors",
      cache: "default",
    };
    // Handle If # is in the input
    let hue = this.state.hue;
    hue = hue.split("#");
    hue = hue[1];
    // Query the resulting string and update state
    fetch(
      `https://www.thecolorapi.com/scheme?hex=${hue}&mode=${this.state.colorScheme}&count=${this.state.numColors}`,
      myInit,
    )
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        let colors = response.colors;
        return colors.map((color) => {
          let hex = color.hex.value;
          let name = color.name.value;
          color = {
            name: name,
            hex: hex,
          };
          return color;
        });
      })
      .then((response) => {
        this.setState({
          colorList: response,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //This resets state to an empty array
  handleRefresh(event) {
    const myInit = {
      method: "GET",
      mode: "cors",
      cache: "default",
    };
    const newColor = randomColor();
    let color = newColor.split("#");
    color = color[1];

    fetch(
      `https://www.thecolorapi.com/scheme?hex=${color}&count=${this.state.numColors}&mode=${this.state.colorScheme}`,
      myInit,
    )
      .then((response) => response.json())
      .then((response) => {
        let colors = response.colors;
        return colors.map((color) => {
          let hex = color.hex.value;
          let name = color.name.value;
          color = {
            name: name,
            hex: hex,
          };
          return color;
        });
      })
      .then((response) => {
        this.setState({
          colorList: response,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    return (
      <div className="appContainer" style={{ backgroundColor: "whitesmoke" }}>
        <Header />
        <div>
          <ColorList data={this.state} />
        </div>
        <Control
          data={this.state}
          onChange={this.handleChange}
          onClick={this.handleClick}
          onRefresh={this.handleRefresh}
        />
      </div>
    );
  }
}

export default App;
