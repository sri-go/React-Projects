import React, { useState, useEffect } from 'react';
import Control from './Control';
import Details from './Details';
import Main from './Main';
import Week from './Week';
import Map from './Map';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import '../Styles/App.css';
import 'bulma/css/bulma.css';
library.add(fas);

export default function App() {
  const [done, setDone] = useState(undefined);
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(undefined);
  const [coordinates, setCoordinates] = useState([
    40.741621,
    -73.99353,
  ]);
  const [date, setDate] = useState();

  useEffect(() => {
    let lat, long;
    //default to NYC to get data
    console.log(coordinates);
    lat = coordinates[0];
    long = coordinates[1];

    const fetchData = async function () {
      let date = new Date();
      setDate(date);
      date.setDate(date.getDate() + 7);
      date = date.toISOString();

      const day_weather = await fetch(
        `https://api.climacell.co/v3/weather/realtime?lat=${lat}&lon=${long}&unit_system=us&fields%5B%5D=temp&fields%5B%5D=feels_like&fields%5B%5D=baro_pressure&fields%5B%5D=wind_speed&fields%5B%5D=dewpoint&fields%5B%5D=humidity&fields%5B%5D=weather_code&apikey=WgGx8VA8VQUANapmJ6AkIEmObMfbWt9d`,
      )
        .then((response) => response.json())
        .catch((error) => console.log(error));

      const week_weather = await fetch(
        `https://api.climacell.co/v3/weather/forecast/daily?lat=${lat}&lon=${long}&end_time=${date}&fields%5B%5D=temp&fields%5B%5D=weather_code&unit_system=us&apikey=WgGx8VA8VQUANapmJ6AkIEmObMfbWt9d`,
      )
        .then((response) => response.json())
        .catch((error) => console.log(error));

      // const weather_tiles = await fetch(`https://api.climacell.co/v3/weather/layers/temperature/now/10/1/0.png?apikey=WgGx8VA8VQUANapmJ6AkIEmObMfbWt9d
      // `)
      //   .then((response) => response.json())
      //   .then((response) => console.log(response))
      //   .catch((error) => console.log(error));

      const combined = { day: day_weather, week: week_weather };
      setWeather(combined);
      setDone(true);
    };

    fetchData();
  }, [coordinates]);

  function handleChange(event) {
    setLocation(event.target.value);
  }

  function handleClick() {
    setDone(false);
    //Gets location inputted and fetches geocoded location data
    //Sends geocode to getWeather function to return weather data and then sets it to state
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=pk.eyJ1Ijoic3JpLWdvIiwiYSI6ImNrODUyeHp1YjAyb2wzZXA4b21veGhqdjgifQ.wprAUOeXWkoWy1-nbUd1NQ`,
    )
      .then((response) => response.json())
      .then((response) => {
        //returns promise of weather-data
        let lat = response.features[0].center[1];
        let long = response.features[0].center[0];
        setCoordinates([lat, long]);
      })
      .catch((error) => console.log(error));
  }

  function getLocation() {
    setDone(false);
    const geo = navigator.geolocation;
    geo.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setCoordinates([latitude, longitude]);
      console.log(latitude, longitude);
    });
  }

  return (
    <div className="App">
      <Control
        location={location}
        onChange={handleChange}
        onClick={[handleClick, getLocation]}
      />
      {!done ? (
        <div
          div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          Loading
        </div>
      ) : (
        <div>
          <div className="main-info">
            <Details weather={weather.day} />
            <Main weather={weather.day} date={date} />
          </div>
          <div className="map">
            <Map location={coordinates} />
          </div>
          <div className="week-info">
            <Week weather={weather.week} />
          </div>
        </div>
      )}
    </div>
  );
}
