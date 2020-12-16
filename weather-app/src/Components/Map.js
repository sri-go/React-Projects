import React from 'react';
import DarkskyMap from 'react-darksky-map';

const styles = {
  width: '100vw',
  height: '50vh',
};
export default function Map(props) {
  const { location } = props;
  
  return (
    <DarkskyMap
      lat={location[0]}
      lng={location[1]}
      zoom={6}
      mapField="temp"
    />
  );
}
