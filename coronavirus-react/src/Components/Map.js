import React, { useRef, useState, useEffect } from "react";
import MapGL, { Source, Layer } from "react-map-gl";
import {
  StateDeathStyle,
  CountyOutlineStyle,
  CountyDeathStyle,
} from "../Styling/MapStyle";
import StatesBoundaries from "../Data/StateBoundaries.json";
import CountyBoundaries from "../Data/CountyBoundaries.json";
import { get_states_data, get_counties_data } from "../Data/FetchData";

const initialViewport = {
  width: "100vw",
  height: "100vh",
  latitude: 39.5,
  longitude: -98.35,
  zoom: 5,
};

const ACCESS_TOKEN =
  "pk.eyJ1Ijoic3JpLWdvIiwiYSI6ImNrODUyeHp1YjAyb2wzZXA4b21veGhqdjgifQ.wprAUOeXWkoWy1-nbUd1NQ";

export default function Map() {
  const [viewport, setViewport] = useState({ ...initialViewport });
  const [StatesData, setStateData] = useState(null);
  const [CountyData, setCountyData] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState();
  const [hover, setHover] = useState(0.5);
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleMapLoad = () => setMapLoaded(true);

  const handleViewStateChange = ({ viewState }) => {
    setViewport(viewState);
  };

  //loads map on page load
  useEffect(() => {
    //gets latest data -> returns a promise
    const states_data = get_states_data(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/07-15-2020.csv"
    );
    //set the fetched data into state
    states_data.then(() => {
      setStateData(StatesBoundaries);
    });

    const county_data = get_counties_data(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/07-15-2020.csv"
    );
    //set the fetched data into state
    county_data.then((response) => {
      console.log(response);
      setCountyData(CountyBoundaries);
      console.log(CountyBoundaries);
    });

    if (mapLoaded) {
      const map = mapRef.current.getMap();
      const visibleFeatures = map.queryRenderedFeatures();
      console.log("visible features: ", visibleFeatures);
    }
  }, [mapLoaded, mapRef]);

  function onHover(event) {
    // console.log(event);
    // const temp = getMap();
    const {
      features,
      srcEvent: { offsetX, offsetY },
    } = event;

    const feature =
      features &&
      features.find((f) => {
        if (f.layer.id === "data") {
          return f;
        }
      });
    // console.log(hover);

    setHoveredFeature({ feature, x: offsetX, y: offsetY });
  }

  function renderTooltip() {
    const { feature, x, y } = hoveredFeature;
    return (
      feature && (
        <div className="tooltip" style={{ left: x, top: y }}>
          <div>State: {feature.properties.name}</div>
        </div>
      )
    );
  }

  //recieves a pointer event
  function onMouseMove(event) {
    const { point, lngLat, type, srcEvent } = event;
    // console.log(event);
    // if (features.length > 0) {
    //   console.log(event);
    //   // console.log(`mousemove, ${1}`);
    // }
    // console.log(event.target);
    // InteractiveMap.queryRenderedFeatures(point);
  }

  //recieves a pointer event
  function onMouseLeave(event) {
    const { features } = event;
    // if (features.length > 0) {
    //   console.log(event);
    //   // console.log(`mousemove, ${1}`);
    // }
    // mapRef.current.queryRenderedFeatures();
  }

  return (
    <MapGL
      mapboxApiAccessToken={ACCESS_TOKEN}
      mapStyle="mapbox://styles/mapbox/dark-v10"
      {...viewport}
      ref={mapRef}
      onLoad={handleMapLoad}
      onViewportChange={handleViewStateChange}
      // onHover={onHover}
      // onMouseMove={onMouseMove}
      // onMouseLeave={onMouseLeave}
      // interactiveLayerIds={["data", "county-data"]}
    >
      <Source id="states-data" type="geojson" data={StatesData}>
        <Layer key={0} {...StateDeathStyle} />
      </Source>
      <Source id="county-data" type="geojson" data={CountyData}>
        <Layer
          key={1}
          {...CountyDeathStyle}
          paint={{
            "fill-color": {
              property: "Deaths",
              stops: [
                [0, "#fff5f0"],
                [50, "#fee0d2"],
                [100, "#fcbba1"],
                [500, "#fc9272"],
                [1000, "#fb6a4a"],
                [1500, "#ef3b2c"],
                [2500, "#cb181d"],
                [5000, "#99000d"],
              ],
            },
            "fill-opacity": hover,
          }}
        />
        <Layer key={2} {...CountyOutlineStyle} />
      </Source>
      {!!hoveredFeature && renderTooltip()}
    </MapGL>
  );
}
