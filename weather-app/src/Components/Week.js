import React from 'react';
import WeekDetails from './WeekDetails';

export default function Week(props) {
  // console.log(props);
  const { weather } = props;
  const week_details = weather.map((day, index) => {
    // console.log(day);
    return (
      <WeekDetails data={day} key={index} id={index}></WeekDetails>
    );
  });
  return typeof props.weather === undefined ? (
    <div>1 </div>
  ) : (
    week_details
  );
}
