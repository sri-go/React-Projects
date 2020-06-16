import React from "react";

export default function Tutorial(props) {
  console.log(props);

  function handleClick() {
    props.onClick();
  }

  return <button onClick={() => props.onClick()}>{props.hello}</button>;
}

