import React, { useEffect, useRef } from 'react';

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

export default function Control(props) {
  const geocoder = useRef();
  
  let accessToken = process.env.REACT_APP_MAPBOX_KEY; //mapbox geocoder api key
  
  // initalize an instance of Mapbox Geocoder
  let mapboxGeocoder = new MapboxGeocoder({
    accessToken: accessToken,
    types: 'country,region,place,postcode,locality,neighborhood',
  });
  
  // mount the geocoder to the DOM on load
  useEffect(() => {
    mapboxGeocoder.addTo(geocoder.current);
  }, []);

  useEffect(() => {
    mapboxGeocoder.on('result', (Object) => {
      props.sendLocation(Object.result.center);
    });
  });

  return (
    <div className="control">
      <a
        className="button"
        onClick={props.onClick()}
        style={{ boxShadow: '0 0 10px 2px rgba(0,0,0,.1)' }}
      >
        <img
          src="./Assets/cbimage.jpg"
          style={{ width: '16px', height: '16px' }}
        />
      </a>
      <div
        ref={geocoder}
        style={{
          zIndex: 1,
          width: '100%',
          maxWidth: '900px',
          textAlign: 'center',
          top: '20px',
        }}
      ></div>
    </div>
  );
}
