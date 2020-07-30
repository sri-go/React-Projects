import React, { useState, useEffect } from "react";
import StatesBoundaries from "../Data/StateBoundaries.json";
import CountyBoundaries from "../Data/CountyBoundaries.json";
import { get_states_data, get_counties_data } from "../Data/FetchData";
import {
  StateDeathStyle,
  CountyOutlineStyle,
  CountyDeathStyle,
} from "../Styling/MapStyle";
import ReactMapGL, { Source, Layer, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const ACCESS_TOKEN =
  "pk.eyJ1Ijoic3JpLWdvIiwiYSI6ImNrODUyeHp1YjAyb2wzZXA4b21veGhqdjgifQ.wprAUOeXWkoWy1-nbUd1NQ";

export default function CountyMap() {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 39.5,
    longitude: -98.35,
    zoom: 3,
  });
  const [CountyData, setCountyData] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState();

  //loads map on page load
  useEffect(() => {
    //gets latest data -> returns a promise
    const county_data = get_counties_data(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/07-15-2020.csv"
    );

    //set the fetched data into state
    county_data.then((response) => {
      console.log(response);
      setCountyData(CountyBoundaries);
      console.log(CountyBoundaries);
    });
  }, []);

  function onHover(event) {
    const {
      features,
      srcEvent: { offsetX, offsetY },
    } = event;
    const feature =
      features && features.find((f) => f.layer.id === "county-data");
    console.log(feature);
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

  return (
    <ReactMapGL
      mapboxApiAccessToken={ACCESS_TOKEN}
      mapStyle="mapbox://styles/mapbox/dark-v10"
      {...viewport}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      onHover={onHover}
    >
      <Source id="county-data" type="geojson" data={CountyData}>
        <Layer key={1} {...CountyDeathStyle} />
        <Layer key={2} {...CountyOutlineStyle} />
      </Source>
      {!!hoveredFeature && renderTooltip()}
    </ReactMapGL>
  );
}
