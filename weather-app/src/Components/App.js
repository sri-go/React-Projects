import React, { useState, useEffect } from 'react';

import FadeIn from 'react-fade-in';

import Control from './Control';
import Details from './Details';
import Main from './Main';
import Week from './Week';
import Map from './Map';

import '../Styles/App.css';
import 'bulma/css/bulma.css';

export default function App() {
  const [done, setDone] = useState(false);
  const [weather, setWeather] = useState();
  const [coordinates, setCoordinates] = useState([
    40.741621,
    -73.99353,
  ]);
  const [date, setDate] = useState();

  // returns weather data
  const fetchData = async (lat, long) => {
    let date = new Date();
    setDate(date);

    let hourly_date = date.setDate(date.getDate() + 1);
    hourly_date = date.toISOString();
    let weekly_date = date.setDate(date.getDate() + 7);
    weekly_date = date.toISOString();

    const day_weather = await fetch(
      `https://api.climacell.co/v3/weather/realtime?lat=${lat}&lon=${long}&unit_system=us&fields%5B%5D=temp&fields%5B%5D=feels_like&fields%5B%5D=baro_pressure&fields%5B%5D=wind_speed&fields%5B%5D=dewpoint&fields%5B%5D=humidity&fields%5B%5D=weather_code&apikey=${process.env.REACT_APP_CLIMACELL_KEY}`,
    )
      .then((response) => response.json())
      .catch((error) => console.log(error));

    const hourly_weather = await fetch(
      `https://api.climacell.co/v3/weather/forecast/hourly?unit_system=us&start_time=now&end_time=${hourly_date}&lat=${lat}&lon=${long}&apikey=${process.env.REACT_APP_CLIMACELL_KEY}`,
    )
      .then((response) => response.json())
      .catch((error) => console.log(error));

    const week_weather = await fetch(
      `https://api.climacell.co/v3/weather/forecast/daily?lat=${lat}&lon=${long}&end_time=${weekly_date}&fields%5B%5D=temp&fields%5B%5D=weather_code&unit_system=us&apikey=${process.env.REACT_APP_CLIMACELL_KEY}`,
    )
      .then((response) => response.json())
      .catch((error) => console.log(error));

    Promise.all([day_weather, hourly_weather, week_weather]).then(
      (values) => {
        console.log(values);
        setWeather({
          day: values[0],
          hourly: values[1],
          week: values[2],
        });
        setDone(true);
      },
    );
  };

  useEffect(() => {
    let lat, long;
    //default to NYC to get data
    lat = coordinates[0];
    long = coordinates[1];
    fetchData(lat, long);
  }, [coordinates]);

  const getSelectedLocation = (result) => {
    setCoordinates([result[1], result[0]]);
  };

  const getCurrentLocation = () => {
    const geo = navigator.geolocation;
    geo.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setCoordinates([latitude, longitude]);
    });
  };

  return (
    <div className="App">
      <Control
        sendLocation={getSelectedLocation}
        onClick={getCurrentLocation}
      />
      {done && (
        <div>
          <FadeIn>
            <div className="main-info">
              <Details weather={weather.day} />
              <Main
                weather={weather.day}
                date={date}
                hourly_weather={weather.hourly}
              />
            </div>
          </FadeIn>
          <FadeIn>
            <div className="map">
              <Map location={coordinates} />
            </div>
          </FadeIn>
          <FadeIn>
            <div
              style={{
                width: '100%',
                maxWidth: '830px',
                margin: '0 auto',
              }}
              className="week-info"
            >
              <Week weather={weather.week} />
            </div>
          </FadeIn>
        </div>
      )}
    </div>
  );
}
