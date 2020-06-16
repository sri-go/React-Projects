import React from "react";
import Tutorial from "./Tutorial";
import "./App.css";

function App() {
  function handleClick() {
    console.log(1);
  }

  return (
    <div className="App">
      <h1>1</h1>
      <Tutorial onClick={handleClick} hello={5}></Tutorial>
    </div>
  );
}

export default App;
