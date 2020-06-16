import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Control(props) {
  // console.log(props);
  function handleChange(event) {
    props.onChange(event);
  }
  function handleClick() {
    props.onClick();
  }

  return (
    <div className="control">
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
