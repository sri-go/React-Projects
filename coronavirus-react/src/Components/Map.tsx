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

import { getStatesData } from "../Data/FetchStateData";
import { getCountiesData } from "../Data/FetchCountyData";

import StateBoundaries from "../Data/StateBoundaries.json";
import CountyBoundaries from "../Data/CountyBoundaries.json";

import {
  StateDeathStyle,
  CountyDeathStyle,
  CountyOutlineStyle,
} from "../Map Styles/MapStyles";

import "../Styles/map.css";
import Sidebar from "./Sidebar";
import Legend from "./Legend";

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_KEY;

const Map = () => {
  const initialViewport = {
    latitude: 39.5,
    longitude: -98.35,
    zoom: 4.5,
    bearing: 0,
    pitch: 0,
  };

  const mapRef = useRef<MapGL>(null);
  const [viewport, setViewport] = useState<any>({
    ...initialViewport,
  });
  
  const [hoveredFeature, setHoveredFeature] = useState<any>();
  const [tempFeature, setTempFeature] = useState<any>();
  const [clickedFeature, setClickedFeature] = useState(null);
  
  const [statesData, setStatesData] = useState<any>(null);
  const [countiesData, setCountiesData] = useState<any>(null);
  const [usTotalData, setUSTotalData] = useState<any>();

  const setUSTotals = (returnData: any) => {
    setUSTotalData(returnData);
  }

  useEffect(() => {
    // Fetch states data
    const statesData = getStatesData(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/07-15-2020.csv", setUSTotals
    );
    statesData.then((response) => {
      setStatesData(StateBoundaries);
    });

    // Fetch counties data
    const countyData = getCountiesData(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/07-15-2020.csv"
    );
    countyData.then(() => {
      setCountiesData(CountyBoundaries);
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
        if (f.layer.id === "states-data" || f.layer.id === "county-data") {
          return f;
        }
      });
    setHoveredFeature({ feature, x: offsetX, y: offsetY });
    //This is to return the data within the layer and change the hover opacity
    if (null !== mapRef.current) {
      const map = mapRef.current.getMap();
      const featured = map.queryRenderedFeatures(point, {
        layers: ["states-data", "county-data"],
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
      if (tempFeature) {
        map.setFeatureState(
          {
            source: "county-data",
            id: tempFeature.id,
          },
          {
            hover: false,
          }
        );
        map.setFeatureState(
          {
            source: "states-data",
            id: tempFeature.id,
          },
          {
            hover: false,
          }
        );
        setTempFeature(null);
      }
    }
  };

  const onClick = (event: any) => {
    const feature = event.features[0];
    if (feature) {
      // calculate the bounding box of the feature
      const [minLng, minLat, maxLng, maxLat] = bbox(feature);
      // construct a viewport instance from the current state
      const newViewport = new WebMercatorViewport(viewport);
      const { longitude, latitude, zoom } = newViewport.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 40 }
      );
      setViewport({
        ...viewport,
        longitude,
        latitude,
        zoom,
        transitionInterpolator: new LinearInterpolator({
          around: [event.offsetCenter.x, event.offsetCenter.y],
        }),
        transitionDuration: 1000,
      });
      setClickedFeature(feature);
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
    <div style={{ display: "flex" }}>
      <div style={{ width: "70%" }}>
        <MapGL
          {...viewport}
          mapboxApiAccessToken={ACCESS_TOKEN}
          width="100%"
          height="100vh"
          mapStyle="mapbox://styles/mapbox/dark-v10"
          ref={mapRef}
          onViewportChange={onViewportChange}
          onHover={onHover}
          onMouseMove={onMouseMove}
          onClick={onClick}
          interactiveLayerIds={["states-data", "county-data"]}
        >
          <Source id="states-data" type="geojson" data={statesData}>
            {/* @ts-ignore */}
            <Layer key={"state"} {...StateDeathStyle} />
          </Source>
          <Source id="county-data" type="geojson" data={countiesData}>
            {/* @ts-ignore */}
            <Layer key={"county"} {...CountyDeathStyle} />
            <Layer key={"county-boundaries"} {...CountyOutlineStyle} />
          </Source>
          {!!hoveredFeature && renderTooltip()}
        </MapGL>
        <Legend zoom={viewport.zoom}></Legend>
      </div>
      <div style={{ width: "30%", background: "rgb(42 42 42)" }}>
        <Sidebar feature={clickedFeature} totalData={usTotalData} />
      </div>
    </div>
  );
};

export default Map;
