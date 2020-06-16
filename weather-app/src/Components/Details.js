import React from 'react';

export default function Details(props) {
  const { weather } = props;
  let loading = undefined;
  typeof weather === undefined ? (loading = true) : (loading = false);

  if (!loading) {
    return (
      <div className="detailsWrapper">
        <div className="details">
          <div className="wind">
            <span className="label">Wind:</span>
            <span>
              {weather.wind_speed.value} {weather.wind_speed.units}
            </span>
          </div>
          <div className="humidity">
            <span className="label">Humidity:</span>
            <span>
              {weather.humidity.value} {weather.humidity.units}
            </span>
          </div>
          <div className="dew_point">
            <span className="label">Dew Point:</span>
            <span>
              {weather.dewpoint.value} {weather.dewpoint.units}
            </span>
          </div>
          <div className="visibility">
            <span className="label">Visibility:</span>
            <span>{weather.weather_code.value}</span>
          </div>
          <div className="pressure">
            <span className="label">Pressure:</span>
            <span>
              {weather.baro_pressure.value}{' '}
              {weather.baro_pressure.units}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return <div>Loading</div>;
}
