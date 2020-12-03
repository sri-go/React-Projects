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
import {
  filterDates,
  getTimeSeries,
  countryAnalysis,
  StateTwoWeekData,
  CountyTwoWeekData,
} from "../Data/FetchTimeSeries";

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

// URL function for data fetching
const createURL = () => {
  const today = new Date();
  const priorDate = new Date().setDate(today.getDate() - 1);
  const priorDateTs = new Date(priorDate);

  let day = priorDateTs.getDate();
  let month = priorDateTs.getMonth() + 1;
  let year = priorDateTs.getFullYear();

  let monthStr, dayStr;

  if (month <= 9) {
    monthStr = "0" + month.toString();
  } else {
    monthStr = month.toString();
  }
  if (day < 10) {
    dayStr = "0" + day.toString();
  } else {
    dayStr = day.toString();
  }

  let url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${monthStr}-${dayStr}-${year}.csv`;

  return url;
};

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
  const [timeSeriesData, setTimeSeriesData] = useState<any>();

  const [legendStyle, setLegendStyle] = useState("visible");

  const setUSTotals = (returnData: any) => {
    setUSTotalData(returnData);
  };

  // On Component Load
  useEffect(() => {
    // Fetch States Data
    const statesData = getStatesData(createURL(), setUSTotals);

    // Fetch counties Data
    const countyData = getCountiesData(createURL());
    // countyData.then(() => {
    //   setCountiesData(CountyBoundaries);
    // });

    // Fetch Time Series Confirmed Data
    const getConfirmedData = getTimeSeries(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"
    );
    getConfirmedData.then((response) => {
      setTimeSeriesData(response); // set the timeseries data after feth
      countryAnalysis(response); // to do: analysis of us as a whole
      const dates = filterDates();
      const stateTimeSeries = StateTwoWeekData(response, dates);
      const countyTimeSeries = CountyTwoWeekData(response, dates);
      console.log(countyTimeSeries);
      setStatesData(StateBoundaries);
      setCountiesData(CountyBoundaries);
    });

    // Fetch Time Series Deaths Data
    const getDeathsData = getTimeSeries(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"
    );
    getDeathsData.then((reponse) => {});
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
          totalData={usTotalData}
          timeSeriesData={timeSeriesData}
        />
      </div>
    </div>
  );
};

export default Map;
