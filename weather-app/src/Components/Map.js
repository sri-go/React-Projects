import React from 'react';
import DarkskyMap from 'react-darksky-map';

const styles = {
  width: '100vw',
  height: '50vh',
};

export default function Map(props) {
  const { location } = props;
  const lat = location[0];
  const lng = location[1];
  return (
    <DarkskyMap
      lat={lat}
      lng={lng}
      zoom={10}
      mapField="temp"
    ></DarkskyMap>
  );
}
