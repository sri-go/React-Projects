import React from 'react';
import DarkskyMap from 'react-darksky-map';

const styles = {
  width: '100vw',
  height: '50vh',
};

export default function Map(props) {
  console.log('x', props.location[1]);
  console.log('y', props.location[0]);

  return (
    <DarkskyMap
      lat={props.location[0]}
      lng={props.location[1]}
      zoom={6}
      mapField="temp"
    ></DarkskyMap>
  );
}
