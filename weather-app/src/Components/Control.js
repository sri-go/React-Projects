import React from 'react';
import { FaLocationArrow, FaSearch } from 'react-icons/fa';

export default function Control(props) {
  // console.log(props);
  function handleChange(event) {
    props.onChange(event);
  }
  function handleClick() {
    //1st function in array
    props.onClick[0]();
  }

  return (
    <div className="control">
      <button
        className="button"
        onClick={() => {
          //2nd function in array
          props.onClick[1]();
        }}
      >
        <FaLocationArrow />
      </button>
      <input
        style={{ width: '50%' }}
        className="input"
        placeholder="Enter Location"
        value={props.location}
        onChange={handleChange}
        name="location"
      ></input>
      <button className="button" onClick={handleClick}>
        <FaSearch />
      </button>
    </div>
  );
}
