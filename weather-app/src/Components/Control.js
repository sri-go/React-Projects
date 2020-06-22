import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
        <FontAwesomeIcon icon={['fas', 'location-arrow']} />
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
        <FontAwesomeIcon icon={['fas', 'search']} />
      </button>
    </div>
  );
}
