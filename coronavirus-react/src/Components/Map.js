import React, { useState, useEffect, useRef } from "react";
import StatesBoundaries from "../Data/StateBoundaries.json";
import CountyBoundaries from "../Data/CountyBoundaries.json";
import { get_states_data, get_counties_data } from "../Data/FetchData";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3JpLWdvIiwiYSI6ImNrODUyeHp1YjAyb2wzZXA4b21veGhqdjgifQ.wprAUOeXWkoWy1-nbUd1NQ";

//   39.5, -98.35
export default function Map() {
  const [[lat, lng], setLatLng] = useState([-98.35, 39.5]);
  const [zoom, setZoom] = useState(3.8);
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  //loads map on page load
  useEffect(() => {
    //gets latest data
    const states_data = get_states_data(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/07-15-2020.csv"
    );

    const county_data = get_counties_data(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/07-15-2020.csv"
    );

    const InitializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v10", // stylesheet location
        center: [lat, lng],
        zoom: zoom,
      });

      map.on("load", () => {
        map.addSource("states_data", {
          type: "geojson",
          data: StatesBoundaries,
        });
        //Styling For US Deaths, Default Visibiliy is On
        map.addLayer({
          id: "Deaths_Style",
          type: "fill",
          source: "states_data",
          paint: {
            "fill-color": {
              property: "Deaths",
              //red colors
              stops: [
                [0, "#fff5f0"],
                [50, "#fee0d2"],
                [100, "#fcbba1"],
                [500, "#fc9272"],
                [1000, "#fb6a4a"],
                [5000, "#ef3b2c"],
                [10000, "#cb181d"],
                [20000, "#99000d"],
              ],
            },
            //change opacity on hover, default to 50% opacity
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              1,
              0.5,
            ],
          },
          layout: {
            // make layer visible by default
            visibility: "visible",
          },
          maxzoom: 5.5,
        });
        //Styling For US Confirmed, Default Visibility is Off
        map.addLayer({
          id: "Confirmed_Style",
          type: "fill",
          source: "states_data",
          paint: {
            "fill-color": {
              property: "Confirmed",
              stops: [
                [0, "#f7fbff"],
                [100, "#deebf7"],
                [500, "#c6dbef"],
                [1000, "#9ecae1"],
                [5000, "#6baed6"],
                [10000, "#4292c6"],
                [50000, "#2171b5"],
                [100000, "#084594"],
              ],
            },
            //change opacity on hover, default to 50% opacity
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              1,
              0.5,
            ],
          },
          layout: {
            // make layer hidden by default
            visibility: "none",
          },
          maxzoom: 5.5,
        });
        // Load Source Data + Polygon Boundaries for US County
        map.addSource("counties_data", {
          type: "geojson",
          data: CountyBoundaries,
        });
        // Map Styling For US Counties, Deaths, Default Visibility is On
        map.addLayer(
          {
            id: "counties_data_outline",
            type: "fill",
            source: "counties_data",
            paint: {
              "fill-outline-color": "rgba(218, 223, 247,0.75)",
            },
            minzoom: 5.5,
          },
          "settlement-label"
        );
        // Map Styling For US Counties, Deaths, Default Visibility is On
        map.addLayer(
          {
            id: "County_Deaths_Style",
            type: "fill",
            source: "counties_data",
            paint: {
              "fill-color": {
                property: "Deaths",
                //red colors
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
              //change opacity on hover, default to 50% opacity
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                1,
                0.5,
              ],
            },
            layout: {
              // make layer visible by default
              visibility: "visible",
            },
            minzoom: 5.5,
          },
          "settlement-label"
        );
        // Map Styling For US Counties, Confirmed, Default Visibility is Off
        map.addLayer(
          {
            id: "County_Confirmed_Style",
            type: "fill",
            source: "counties_data",
            paint: {
              "fill-color": {
                property: "Confirmed",
                //blue colors
                stops: [
                  [0, "#f7fbff"],
                  [100, "#deebf7"],
                  [500, "#c6dbef"],
                  [1000, "#9ecae1"],
                  [5000, "#6baed6"],
                  [10000, "#4292c6"],
                  [50000, "#2171b5"],
                  [100000, "#084594"],
                ],
              },
              //change opacity on hover, default to 50% opacity
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                1,
                0.5,
              ],
            },
            layout: {
              // make layer visible by default
              visibility: "none",
            },
            minzoom: 5.5,
          },
          "settlement-label"
        );

        setMap(map);
        map.resize();
      });

      //   console.log(StatesBoundaries);
    };

    if (!map) InitializeMap({ setMap, mapContainer });

    // clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div ref={(el) => (mapContainer.current = el)} className="mapContainer" />
  );
}
