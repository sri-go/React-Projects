import React from 'react';

export default function Main(props) {
  const { weather, date } = props;
  let loading = undefined;
  typeof weather === undefined ? (loading = true) : (loading = false);

  const time = date.getHours();
  let day;
  time > 18 ? (day = '_night') : (day = '_day');
  const weather_array = ['partly_cloudy', 'mostly_clear', 'clear'];

  // public url:  /Assets/color/
  if (!loading) {
    let img_src;
    img_src = weather_array.includes(weather.weather_code.value)
      ? (img_src = `${process.env.PUBLIC_URL}/${weather.weather_code.value}${day}.svg`)
      : (img_src = `${process.env.PUBLIC_URL}/${weather.weather_code.value}.svg`);

    // console.log(img_src);
    return (
      <div className="center">
        <div className="title">
          <span className="currently">
            <span className="icon">
              <img src={img_src} alt="product" />
            </span>
            <span className="description">
              <span className="summary">
                <span className="label">Temperature:</span>
                <span>
                  {weather.temp.value} &deg;{weather.temp.units}
                </span>
              </span>
              <span className="summary-high-low">
                <span className="label">Feels Like:</span>
                <span>
                  {weather.feels_like.value} &deg;
                  {weather.feels_like.units}
                </span>
              </span>
            </span>
          </span>
        </div>
      </div>
    );
  }
  return <div> Loading </div>;
}
