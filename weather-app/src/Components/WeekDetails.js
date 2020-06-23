import React from 'react';

export default function WeekDetails(props) {
  //   console.log(props);
  console.log(process.env.PUBLIC_URL);
  const { data } = props;
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
        alignItems: 'center',
        justifyContent: 'center',
        margin: '.5em 0em',
      }}
    >
      <div>{dateReadable}</div>
      <div>
        <span className="icon">
          <img src={img_src} alt="product" />
        </span>
      </div>
      <div>
        Min: {data.temp[0].min.value} &deg;{data.temp[0].min.units}
        <br />
        Max: {data.temp[1].max.value} &deg;{data.temp[1].max.units}
      </div>
    </div>
  );
}
