import React, { useState, useEffect } from 'react';
import Lottie from 'react-lottie';
import FadeIn from 'react-fade-in';

import Control from './Control';
import Details from './Details';
import Main from './Main';
import Week from './Week';
import Map from './Map';

import '../Styles/App.css';
import 'bulma/css/bulma.css';
import animationData2 from '../lotties/24847-confirmation.json';

export default function App() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(undefined);
  const [coordinates, setCoordinates] = useState([
    40.741621,
    -73.99353,
  ]);
  const [date, setDate] = useState();

  useEffect(() => {
    setDone(false);

    let lat, long;

    //default to NYC to get data
    lat = coordinates[0];
    long = coordinates[1];

    const data = fetchData(lat, long);
    data.then((res) => {
      setWeather(res);
    });
  }, [coordinates]);

  const fetchData = async function (lat, long) {
    let date = new Date();
    setDate(date);

    let hourly_date = date.setDate(date.getDate() + 1);
    hourly_date = date.toISOString();
    let weekly_date = date.setDate(date.getDate() + 7);
    weekly_date = date.toISOString();

    try {
      const day_weather = await fetch(
        `https://api.climacell.co/v3/weather/realtime?lat=${lat}&lon=${long}&unit_system=us&fields%5B%5D=temp&fields%5B%5D=feels_like&fields%5B%5D=baro_pressure&fields%5B%5D=wind_speed&fields%5B%5D=dewpoint&fields%5B%5D=humidity&fields%5B%5D=weather_code&apikey=GT9RlI6sr2OjyLvlGOdOF4RX0qLgkFxH`,
      );

      const hourly_weather = await fetch(
        `https://api.climacell.co/v3/weather/forecast/hourly?unit_system=us&start_time=now&end_time=${hourly_date}&lat=${lat}&lon=${long}&apikey=GT9RlI6sr2OjyLvlGOdOF4RX0qLgkFxH`,
      );

      const week_weather = await fetch(
        `https://api.climacell.co/v3/weather/forecast/daily?lat=${lat}&lon=${long}&end_time=${weekly_date}&fields%5B%5D=temp&fields%5B%5D=weather_code&unit_system=us&apikey=GT9RlI6sr2OjyLvlGOdOF4RX0qLgkFxH`,
      );

      var combined = {
        day: await day_weather.json(),
        hourly: await hourly_weather.json(),
        week: await week_weather.json(),
      };
      // setWeather(combined);
    } catch (e) {
      console.error(e);
    } finally {
      return combined;
    }
  };

  function handleChange(event) {
    setLocation(event.target.value);
  }

  async function handleClick() {
    setDone(false);

    try {
      //Gets location inputted and fetches geocoded location data
      //Sends geocode to getWeather function to return weather data and then sets it to state
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=pk.eyJ1Ijoic3JpLWdvIiwiYSI6ImNrODUyeHp1YjAyb2wzZXA4b21veGhqdjgifQ.wprAUOeXWkoWy1-nbUd1NQ`,
      );
      const data = await res.json();

      let lat = data.features[0].center[1];
      let long = data.features[0].center[0];
      setCoordinates([lat, long]);
    } catch (e) {
      console.error(e);
    }
  }

  function getLocation(e) {
    setDone(false);
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const geo = window.navigator.geolocation;
    if(geo) {
      return geo.getCurrentPosition(
        (position) => {
          console.log(position);
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(latitude, longitude);
          setCoordinates([latitude, longitude]);
        },
        undefined,
        options,
      );
    } 

    console.log('geolocation not available');
  }

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
        location={location}
        onChange={handleChange}
        onClick={[handleClick, getLocation]}
      />
      {done ? (
        <div>
          <div className="main-info">
            <Details weather={weather.day} />
            <Main
              weather={weather.day}
              date={date}
              hourly_weather={weather.hourly}
            />
          </div>
          <div className="columns is-justify-content-center">
            <Map location={coordinates} />
            <Week weather={weather.week} />
          </div>
        </div>
      ) : (
        <FadeIn>
          <div
            className="is-flex is-justify-content-center is-align-items-center"
            style={{
              height: '90vh'
            }}
          >
            <Lottie
              options={defaultOptions2}
              height={400}
              width={400}
              speed={1}
              eventListeners={[
                {
                  eventName: 'loopComplete',
                  callback: () => {
                    setDone(true);
                    console.log(weather);
                    console.log('the animation completed:');
                  },
                },
              ]}
            ></Lottie>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
