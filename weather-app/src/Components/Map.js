import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const styles = {
  width: '100vw',
  height: '50vh',
};

// Convert Lat and Long to Tile Numbers to query correct tiles to display weather
// Adapted from https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
function long2tile(lon, zoom) {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}
function lat2tile(lat, zoom) {
  return Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) +
          1 / Math.cos((lat * Math.PI) / 180),
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoom),
  );
}

export default function Map(props) {
  // console.log(props);
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  console.log('x', lat2tile(props.location[1], 10));
  console.log('y', long2tile(props.location[0], 10));
  useEffect(() => {
    mapboxgl.accessToken = `pk.eyJ1Ijoic3JpLWdvIiwiYSI6ImNrODUyeHp1YjAyb2wzZXA4b21veGhqdjgifQ.wprAUOeXWkoWy1-nbUd1NQ`;
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
        center: [props.location[1], props.location[0]],
        zoom: 13,
      });

      map.on('load', () => {
        setMap(map);
        map.resize();
        map.addSource('climacell-api', {
          type: 'raster',
          tiles: [
            `https://api.climacell.co/v3/weather/layers/temperature/now/10/${lat2tile(
              props.location[1],
              10,
            )}/${long2tile(
              props.location[0],
              10,
            )}.png?apikey=WgGx8VA8VQUANapmJ6AkIEmObMfbWt9d`,
          ],
          tileSize: 256,
          attribution:
            '&copy; <a href="https://www.climacell.co/weather-api">Powered by ClimaCell</a>',
        });
        map.addLayer({
          id: 'radar-tiles',
          type: 'raster',
          source: 'climacell-api',
          minzoom: 1,
          maxzoom: 12,
        });
      });
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  return (
    <div ref={(el) => (mapContainer.current = el)} style={styles} />
  );
}

// map.addSource('climacell-api', {
//   "type": 'raster',
//   "tiles": [`https://api.climacell.co/v3/weather/layers/${CC_DATA_FIELD}/${CC_TIMESTAMP}/{zoom}/{coord.x}/{coord.y}.png?apikey=${CC_API_KEY}`],
//   "tileSize": 256,
//   "attribution": '&copy; <a href="https://www.climacell.co/weather-api">Powered by ClimaCell</a>'
// });
// map.addLayer({
//   "id": "radar-tiles",
//   "type": "raster",
//   "source": "climacell-api",
//   "minzoom": 1,
//   "maxzoom": 12
// });
