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

import { fetchData, filterData } from "../Data/FetchData"; //to do: rename file to something else

import StateBoundaries from "../Data/StateBoundaries.json";
import CountyBoundaries from "../Data/CountyBoundaries.json";

import {
  StateDeathStyle,
  CountyDeathStyle,
  CountyOutlineStyle,
  StateTwoWeekConfirmedStyle,
  CountyTwoWeekConfirmedStyle,
} from "../Map Styles/MapStyles";

import "../Styles/map.css";
import Sidebar from "./Sidebar";
import Legend from "./Legend";
import ControlPanel from "./ControlPanel";

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_KEY;

const Map = () => {
  const initialViewport = {
    latitude: 39.5,
    longitude: -98.35,
    zoom: 3,
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
  const [usDeathsTotal, setUSDeathsTotal] = useState<any>();
  const [usConfirmedTotal, setUSConfirmedTotal] = useState<any>();
  const [confirmedData, setConfirmedData] = useState<any>();
  const [deathsData, setDeathsData] = useState<any>();

  const [legendStyle, setLegendStyle] = useState("visible");

  const setUSTotals = (returnData: any) => {
    if (!!returnData.USConfirmedTotal) {
      setUSConfirmedTotal(returnData.USConfirmedTotal);
    }
    if (!!returnData.USDeathsTotal) {
      setUSDeathsTotal(returnData.USDeathsTotal);
    }
  };
  // On Component Load
  useEffect(() => {
    // Fetch Data
    const getConfirmedData = fetchData(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"
    );
    getConfirmedData.then((response) => {
      setConfirmedData(response);
      filterData(response, undefined, setUSTotals);
      setStatesData(StateBoundaries);
      setCountiesData(CountyBoundaries);
    });
    // // Fetch Time Series Deaths Data
    const getDeathsData = fetchData(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv"
    );
    getDeathsData.then((response) => {
      setDeathsData(response);
      filterData(undefined, response, setUSTotals);
    });
  }, []);

  const onViewportChange = (nextViewport: ViewportProps) => {
    setViewport(nextViewport);
  };

  const onHover = (event: PointerEvent) => {
    const {
      point,
      srcEvent: { offsetX, offsetY },
    } = event;

    //This is to return the data within the layer and change the hover opacity
    if (null !== mapRef.current) {
      const map = mapRef.current.getMap();
      const featured = map.queryRenderedFeatures(point, {
        layers: [
          "states-data",
          "county-data",
          "StateTwoWeek-ConfirmedData",
          "CountyTwoWeek-ConfirmedData",
        ],
      })[0];
      setHoveredFeature({ featured, x: offsetX, y: offsetY });
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
    const { point } = event;

    if (null !== mapRef.current) {
      const map = mapRef.current.getMap();
      const featured = map.queryRenderedFeatures(point, {
        layers: ["states-data", "county-data", "StateTwoWeek-ConfirmedData"],
      })[0];
      if (!!featured) {
        // @ts-ignore
        const [minLng, minLat, maxLng, maxLat] = bbox(featured);
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
        // @ts-ignore
        setClickedFeature(featured);
      }
    }
  };

  const renderTooltip = () => {
    const { featured, x, y } = hoveredFeature;
    // if hovered
    if (featured) {
      let source = featured.source;
      if (source === "states-data") {
        const stateTag = (
          <div className="tooltip" style={{ padding: "10px", left: x, top: y }}>
            <div>{featured.properties.name}</div>
            <div style={{ marginTop: "5px" }}>
              Total Confirmed Cases:{" "}
              {featured.properties.Confirmed.toLocaleString()}
            </div>
            <div style={{ marginTop: "5px" }}>
              Total Confirmed Deaths:{" "}
              {featured.properties.Deaths.toLocaleString()}
            </div>
          </div>
        );
        const twoWeekTag = (
          <div
            className="tooltip"
            style={{
              padding: "10px",
              left: x,
              top: y,
            }}
          >
            <div>{featured.properties.name}</div>
            <div style={{ marginTop: "5px" }}>
              Cases over the last two weeks:{" "}
              {featured.properties.TwoWeekTotal.toLocaleString()}
            </div>
            <div style={{ marginTop: "5px" }}>
              Deaths over the last two weeks:{" "}
              {featured.properties.TwoWeekDeathTotal.toLocaleString()}
            </div>
          </div>
        );
        const tag = featured.layer.id === "states-data" ? stateTag : twoWeekTag;
        return tag;
      }
      if (source === "county-data") {
        const countyTag = (
          <div
            className="tooltip"
            style={{
              padding: "10px",
              left: x,
              top: y,
            }}
          >
            <div>{featured.properties.NAME} County</div>
            <div style={{ marginTop: "5px" }}>
              Total Number of Cases:{" "}
              {featured.properties.Confirmed.toLocaleString()}
            </div>
            <div style={{ marginTop: "5px" }}>
              Total Number of Deaths:{" "}
              {featured.properties.Deaths.toLocaleString()}
            </div>
          </div>
        );
        const twoWeekTag = (
          <div
            className="tooltip"
            style={{
              padding: "10px",
              left: x,
              top: y,
            }}
          >
            <div>{featured.properties.NAME} County</div>
            <div style={{ marginTop: "5px" }}>
              Cases over the last two weeks:{" "}
              {featured.properties.TwoWeekTotal.toLocaleString()}
            </div>
            <div style={{ marginTop: "5px" }}>
              Cases over the last two weeks:{" "}
              {featured.properties.TwoWeekDeathTotal.toLocaleString()}
            </div>
          </div>
        );
        const tag =
          featured.layer.id === "county-data" ? countyTag : twoWeekTag;
        return tag;
      }
    }
  };

  // Update legend callback function
  const updateLegend = () => {
    legendStyle === "visible"
      ? setLegendStyle("none")
      : setLegendStyle("visible");
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
            <Layer key={"states-data"} {...StateDeathStyle} />
            {/* @ts-ignore */}
            <Layer key={"state-two-week"} {...StateTwoWeekConfirmedStyle} />
          </Source>
          <Source id="county-data" type="geojson" data={countiesData}>
            {/* @ts-ignore */}
            <Layer key={"county"} {...CountyDeathStyle} />
            {/* @ts-ignore */}
            <Layer key={"county-two-week"} {...CountyTwoWeekConfirmedStyle} />
            {/* @ts-ignore */}
            <Layer key={"county-boundaries"} {...CountyOutlineStyle} />
          </Source>
          {!!hoveredFeature && renderTooltip()}
        </MapGL>
        <Legend zoom={viewport.zoom} legendStyle={legendStyle} />
        <ControlPanel mapRef={mapRef} updateLegendStyle={updateLegend} />
      </div>
      <div
        style={{
          height: "100%",
          background: "rgb(29 29 29)",
          position: "fixed",
          left: "70%",
          top: "0",
          right: "0",
          overflowY: "scroll",
        }}
      >
        <Sidebar
          feature={clickedFeature}
          usConfirmedTotal={usConfirmedTotal}
          usDeathsTotal={usDeathsTotal}
          confirmedData={confirmedData}
          deathsData={deathsData}
        />
      </div>
    </div>
  );
};

export default Map;
