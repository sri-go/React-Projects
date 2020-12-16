import React, { useState, useEffect } from 'react';
import Lottie from 'react-lottie';
import FadeIn from 'react-fade-in';
import Control from './Control';
import Details from './Details';
import Main from './Main';
import Week from './Week';
import Map from './Map';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import '../Styles/App.css';
import 'bulma/css/bulma.css';
import animationData from '../lotties/9825-loading-screen-loader-spinning-circle.json';
import animationData2 from '../lotties/24847-confirmation.json';
library.add(fas);

export default function App() {
  const [done, setDone] = useState(undefined);
  const [loading, setLoading] = useState(false);
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
    lat = coordinates[0];
    long = coordinates[1];

    const fetchData = async function () {
      let date = new Date();
      setDate(date);
      let hourly_date = date.setDate(date.getDate() + 1);
      hourly_date = date.toISOString();
      let weekly_date = date.setDate(date.getDate() + 7);
      weekly_date = date.toISOString();

      const day_weather = await fetch(
        `https://api.climacell.co/v3/weather/realtime?lat=${lat}&lon=${long}&unit_system=us&fields%5B%5D=temp&fields%5B%5D=feels_like&fields%5B%5D=baro_pressure&fields%5B%5D=wind_speed&fields%5B%5D=dewpoint&fields%5B%5D=humidity&fields%5B%5D=weather_code&apikey=GT9RlI6sr2OjyLvlGOdOF4RX0qLgkFxH`,
      )
        .then((response) => response.json())
        .catch((error) => console.log(error));

      const hourly_weather = await fetch(
        `https://api.climacell.co/v3/weather/forecast/hourly?unit_system=us&start_time=now&end_time=${hourly_date}&lat=${lat}&lon=${long}&apikey=GT9RlI6sr2OjyLvlGOdOF4RX0qLgkFxH`,
      )
        .then((response) => response.json())
        .catch((error) => console.log(error));

      const week_weather = await fetch(
        `https://api.climacell.co/v3/weather/forecast/daily?lat=${lat}&lon=${long}&end_time=${weekly_date}&fields%5B%5D=temp&fields%5B%5D=weather_code&unit_system=us&apikey=GT9RlI6sr2OjyLvlGOdOF4RX0qLgkFxH`,
      )
        .then((response) => response.json())
        .catch((error) => console.log(error));

      const combined = {
        day: day_weather,
        hourly: hourly_weather,
        week: week_weather,
      };
      setWeather(combined);
      setLoading(true);
      setTimeout(() => {
        setDone(true);
      }, 1500);
    };

    fetchData();
  }, [coordinates]);

  function handleChange(event) {
    setLocation(event.target.value);
  }

  function handleClick() {
    setDone(false);
    setLoading(false);
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
    setLoading(false);
    const geo = navigator.geolocation;
    geo.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setCoordinates([latitude, longitude]);
    });
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: animationData2,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="App">
      <Control
        sendLocation={handleChange}
        onClick={[handleClick, getLocation]}
      />
      {!done ? (
        <FadeIn>
          <div
            style={{
              height: '90vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {!loading ? (
              <Lottie
                options={defaultOptions}
                height={400}
                width={400}
              ></Lottie>
            ) : (
              <Lottie
                options={defaultOptions2}
                height={400}
                width={400}
              ></Lottie>
            )}
          </div>
        </FadeIn>
      ) : (
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
