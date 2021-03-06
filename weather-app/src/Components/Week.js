import React from 'react';
import WeekDetails from './WeekDetails';

export default function Week(props) {
  const { weather } = props;

  let max, min;
  const findMaxMin = weather.map((day, index) => {
    // if max and min are undefined, store the value at the current index
    if (max === undefined && min === undefined) {
      min = day.temp[0].min.value;
      max = day.temp[1].max.value;
    }
    if (max && min !== undefined) {
      if (day.temp[0].min.value < min) {
        // if the min at the current index is less than the stored min
        min = day.temp[0].min.value;
      }
      // if the max at current day is greater than stored max
      if (day.temp[1].max.value > max) {
        max = day.temp[1].max.value;
      }
    }
  });

  const weekDetails = weather.map((day, index) => {
    return (
      <div
        style={{
          width: '100%',
          maxWidth: '830px',
          margin: '0 auto',
        }}
        className="week-info"
      >
        <WeekDetails
          max={max}
          min={min}
          data={day}
          key={index}
          id={index}
        />
      </div>
    );
  });
  return weekDetails;

}
