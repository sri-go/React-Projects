import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Control(props) {
  const [inputValue, setInputValue] = useState();
  
  function handleChange(event) {
    props.sendLocation(event);
    setInputValue(event.target.value);
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
        placeholder='Enter Location'
        value={inputValue}
        onChange={handleChange}
        name="location"
      />
      <button className="button" onClick={handleClick}>
        <FontAwesomeIcon icon={['fas', 'search']} />
      </button>
    </div>
  );
}
