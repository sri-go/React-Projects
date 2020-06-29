import React from 'react';

export default function Bar(props) {
  //   console.log(props);
  const max = props.max;
  const min = props.min;
  const numSteps = max - min;
  const stepPercent = 100 / numSteps;
  const marginLeftSteps = props.data[0] - min;
  const marginLeft = marginLeftSteps * stepPercent;
  const high = max - props.data[1];
  const width = (numSteps - marginLeftSteps - high) * stepPercent;

  return (
    <span
      style={{
        display: 'block',
        position: 'relative',
        width: '570px',
        height: '100%',
        margin: '0em 3em 1em',
      }}
    >
      {/* Min Temp */}
      <span
        style={{
          textAlign: 'right',
          marginLeft: '-55px',
          lineHeight: '24px',
          fontWeight: '16px',
          fontWeight: '400',
          display: 'block',
          position: 'absolute',
          width: '50px',
          height: '24px',
          left: `${marginLeft}%`,
        }}
      >
        {props.data[0]}&#730;
      </span>
      {/* Bar */}
      <span
        style={{
          display: 'block',
          position: 'absolute',
          marginLeft: `${marginLeft}%`,
          width: `${width}%`,
          minHeight: '20px',
          backgroundColor: `#333`,
          borderRadius: '10px',
        }}
      ></span>
      {/* Max Temp */}
      <span
        style={{
          textAlign: 'left',
          marginLeft: '7px',
          lineHeight: '24px',
          fontWeight: '16px',
          fontWeight: '400',
          display: 'block',
          position: 'absolute',
          width: '50px',
          height: '24px',
          left: `${marginLeft + width}%`,
        }}
      >
        {props.data[1]}&#730;
      </span>
    </span>
  );
}
