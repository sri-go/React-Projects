import React from 'react';
import { FaLocationArrow, FaSearch } from 'react-icons/fa';

export default function Control({ location, onChange, onClick }) {
  console.log(onClick);
  const [handleClick, getLocation] = onClick;

  return (
    <div className="control">
      <button
        className="button"
        onClick={(e) => getLocation(e)}
      >
        <FaLocationArrow />
      </button>
      <input
        style={{ width: '50%' }}
        className="input"
        placeholder="Enter Location"
        value={location}
        onChange={(e) => onChange(e)}
        name="location"
      />
      <button className="button" onClick={(e) => handleClick(e)}>
        <FaSearch />
      </button>
    </div>
  );
}
