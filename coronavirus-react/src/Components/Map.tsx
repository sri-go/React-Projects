import React, { useState, useEffect, useRef } from "react";
import MapGL, {
  Source,
  Layer,
  WebMercatorViewport,
  LinearInterpolator,
  ViewportProps,
  PointerEvent,
} from "react-map-gl";
import { bbox } from "@turf/turf";

import "mapbox-gl/dist/mapbox-gl.css";

import { get_states_data } from "../Data/FetchData";

import StateBoundaries from "../Data/StateBoundaries.json";
import CountyBoundaries from "../Data/CountyBoundaries.json";

import {
  StateDeathStyle,
  CountyDeathStyle,
  CountyOutlineStyle,
} from "../Map Styles/MapStyles";

import "../Styles/map.css";

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_KEY;

const Map = () => {
  const initialViewport = {
    latitude: 39.5,
    longitude: -98.35,
    zoom: 5,
    bearing: 0,
    pitch: 0,
  };

  const mapRef = useRef<MapGL>(null);
  const [viewport, setViewport] = useState<any>({
    ...initialViewport,
  });
  const [hoveredFeature, setHoveredFeature] = useState<any>();
  const [tempFeature, setTempFeature] = useState<any>();
  const [statesData, setStatesData] = useState<any>();

  useEffect(() => {
    const states_data = get_states_data(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/07-15-2020.csv"
    );
    //set the fetched data into statewhyh
    states_data.then(() => {
      setStatesData(StateBoundaries);
    });
  }, []);

  const onViewportChange = (nextViewport: ViewportProps) => {
    setViewport(nextViewport);
  };

  const onHover = (event: PointerEvent) => {
    const {
      features,
      point,
      srcEvent: { offsetX, offsetY },
    } = event;

    //This is for the Hover Label
    const feature =
      features &&
      features.find((f) => {
        if (f.layer.id === "data" || f.layer.id === "county-data") {
          return f;
        }
      });

    setHoveredFeature({ feature, x: offsetX, y: offsetY });
    //This is to return the data within the layer and change the hover opacity
    if (null !== mapRef.current) {
      const map = mapRef.current.getMap();
      const featured = map.queryRenderedFeatures(point, {
        layers: ["data", "county-data"],
      })[0];
      if (featured) {
        map.setFeatureState(
          {
            source: "county-data",
            id: featured.id,
          },
          {
            hover: true,
          }
        );
        map.setFeatureState(
          {
            source: "states-data",
            id: featured.id,
          },
          {
            hover: true,
          }
        );
        setTempFeature(featured);
      }
    }
  };

  const onMouseMove = (event: PointerEvent) => {
    if (null !== mapRef.current) {
      const map = mapRef.current.getMap();
    }
  };

  const onClick = (event: any) => {
    const feature = event.features[0];
    if (feature) {
      const [minLng, minLat, maxLng, maxLat] = bbox(feature);
      // construct a viewport instance from the current state
      const newViewport = new WebMercatorViewport(viewport);
      const { longitude, latitude, zoom } = newViewport.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: 40,
        }
      );
      setViewport({
        ...viewport,
        longitude,
        latitude,
        zoom: 6.5,
        transitionInterpolator: new LinearInterpolator({
          around: [event.offsetCenter.x, event.offsetCenter.y],
        }),
        transitionDuration: 1000,
      });
    }
  };

  const renderTooltip = () => {
    const { feature, x, y } = hoveredFeature;
    if (feature) {
      const stateTag = (
        <div className="tooltip" style={{ padding: "10px", left: x, top: y }}>
          <div>{feature.properties.name}</div>
          <div style={{ marginTop: "5px" }}>
            Total Confirmed Cases: {feature.properties.Confirmed}
          </div>
        </div>
      );

      const countyTag = (
        <div
          className="tooltip"
          style={{
            padding: "10px",
            left: x,
            top: y,
          }}
        >
          <div>{feature.properties.NAME} County</div>
          <div style={{ marginTop: "5px" }}>
            Total Number of Cases: {feature.properties.Confirmed}
          </div>
        </div>
      );
      const tag = feature.source === "states-data" ? stateTag : countyTag;
      return tag;
    }
  };

  return (
    <MapGL
      {...viewport}
      mapboxApiAccessToken={ACCESS_TOKEN}
      width="100vw"
      height="100vh"
      mapStyle="mapbox://styles/mapbox/dark-v10"
      ref={mapRef}
      onViewportChange={onViewportChange}
      onHover={onHover}
      onMouseMove={onMouseMove}
      onClick={onClick}
    >
      {!!hoveredFeature && renderTooltip()}
    </MapGL>
  );
};

export default Map;
