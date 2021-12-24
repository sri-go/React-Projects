import React from 'react';
import DarkskyMap from 'react-darksky-map';
import FadeIn from 'react-fade-in';

export default function Map(props) {
  return (
    <div id="test" className="column is-half-widescreen">
      <DarkskyMap
        lat={props.location[0]}
        lng={props.location[1]}
        zoom={10}
        mapField="precipRadar"
      />
    </div>
  );
}
