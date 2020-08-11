import React, { useRef, useState, useEffect } from "react";
import MapGL, {
  Source,
  Layer,
  LinearInterpolator,
  WebMercatorViewport,
} from "react-map-gl";
import bbox from "@turf/bbox";
import {
  StateDeathStyle,
  CountyOutlineStyle,
  CountyDeathStyle,
} from "../Styling/MapStyle";

import StatesBoundaries from "../Data/StateBoundaries.json";
import CountyBoundaries from "../Data/CountyBoundaries.json";
import {
  get_states_data,
  get_counties_data,
  get_time_series,
} from "../Data/FetchData";
import Plot from "./plot";

//Initalize Viewport
const initialViewport = {
  width: "100vw",
  height: "100vh",
  latitude: 39.5,
  longitude: -98.35,
  zoom: 3,
};

//Mapbox Access Token -> to do: move to env file later
const ACCESS_TOKEN =
  "pk.eyJ1Ijoic3JpLWdvIiwiYSI6ImNrODUyeHp1YjAyb2wzZXA4b21veGhqdjgifQ.wprAUOeXWkoWy1-nbUd1NQ";

export const Map = () => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [localViewState, setLocalViewState] = useState({ ...initialViewport });
  const [hoveredFeature, setHoveredFeature] = useState();
  const [StatesData, setStateData] = useState(null);
  const [CountyData, setCountyData] = useState(null);
  const [TempFeature, setTempFeature] = useState(null);
  const [plotData, setPlotData] = useState(null);

  //Fetch data on load
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
      setCountyData(CountyBoundaries);
      // console.log(CountyBoundaries);
    });
  }, []);

  //Handle hover features
  const onHover = (event) => {
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
          // console.log(f);
          return f;
        }
      });
    setHoveredFeature({ feature, x: offsetX, y: offsetY });

    //This is to return the data within the layer and change the hover opacity
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
  };

  //Handle when user leaves hovered state or county
  const onMouseMove = (event) => {
    const map = mapRef.current.getMap();
    if (TempFeature) {
      map.setFeatureState(
        {
          source: "county-data",
          id: TempFeature.id,
        },
        {
          hover: false,
        }
      );
      map.setFeatureState(
        {
          source: "states-data",
          id: TempFeature.id,
        },
        {
          hover: false,
        }
      );
      setTempFeature(null);
    }
  };

  //Handle click of state or county -> Zooms in
  const onClick = (event) => {
    const feature = event.features[0];
    if (feature) {
      // calculate the bounding box of the feature
      const [minLng, minLat, maxLng, maxLat] = bbox(feature);
      // construct a viewport instance from the current state
      const viewport = new WebMercatorViewport(localViewState);
      const { longitude, latitude, zoom } = viewport.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: 100,
        }
      );
      setLocalViewState({
        ...initialViewport,
        longitude,
        latitude,
        zoom: 6.5,
        transitionInterpolator: new LinearInterpolator({
          around: [event.offsetCenter.x, event.offsetCenter.y],
        }),
        transitionDuration: 1000,
      });

      //To Do
      //On Click Send State/County feature data to Plot
      setPlotData(feature);
    }
  };

  const handleMapLoad = () => setMapLoaded(true);

  const handleViewStateChange = ({ viewState }) => {
    setLocalViewState(viewState);
  };

  const renderTooltip = () => {
    const { feature, x, y } = hoveredFeature;
    if (feature) {
      const stateTag = (
        <div className="tooltip" style={{ left: x, top: y }}>
          <div>State: {feature.properties.name}</div>
        </div>
      );

      const countyTag = (
        <div className="tooltip" style={{ left: x, top: y }}>
          <div>County: {feature.properties.NAME}</div>
        </div>
      );

      const tag = feature.source === "states-data" ? stateTag : countyTag;

      return tag;
    }
  };

  return (
    <MapGL
      {...localViewState}
      mapboxApiAccessToken={ACCESS_TOKEN}
      mapStyle="mapbox://styles/mapbox/dark-v10"
      ref={mapRef}
      onLoad={handleMapLoad}
      onViewStateChange={handleViewStateChange}
      onHover={onHover}
      onMouseMove={onMouseMove}
      onClick={onClick}
      interactiveLayerIds={["data", "county-data"]}
    >
      <Source id="states-data" type="geojson" data={StatesData}>
        <Layer key={"state"} {...StateDeathStyle} />
      </Source>
      <Source id="county-data" type="geojson" data={CountyData}>
        <Layer key={"county"} {...CountyDeathStyle} />
        <Layer key={"county-boundaries"} {...CountyOutlineStyle} />
      </Source>
      <Plot style={{}} feature={plotData} data={CountyBoundaries} />
      {!!hoveredFeature && renderTooltip()}
    </MapGL>
  );
};
