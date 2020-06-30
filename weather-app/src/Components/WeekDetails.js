import React from 'react';
import Bar from './Bar';

export default function WeekDetails(props) {
  //   console.log(props);
  const { max, min, data } = props;
  const weather_array = ['partly_cloudy', 'mostly_clear', 'clear'];
  let img_src;
  img_src = weather_array.includes(data.weather_code.value)
    ? (img_src = `${process.env.PUBLIC_URL}/Assets/color/${data.weather_code.value}_day.svg`)
    : (img_src = `${process.env.PUBLIC_URL}//Assets/color/${data.weather_code.value}.svg`);
  let dateObject = new Date(Date.parse(data.observation_time.value));
  let dateReadable = dateObject.toDateString().split(' ')[0];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '1em 0.5em',
      }}
    >
      <div style={{ margin: '0em 1em 1em' }}>{dateReadable}</div>
      <div>
        <span style={{ margin: '0em 1em 1em' }} className="icon">
          <img src={img_src} alt="product" />
        </span>
      </div>
      <Bar
        max={max}
        min={min}
        data={[data.temp[0].min.value, data.temp[1].max.value]}
      />
    </div>
  );
}
