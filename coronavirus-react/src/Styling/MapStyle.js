//State Styling
export const StateDeathStyle = {
  id: "data",
  type: "fill",
  source: "StatesBoundaries",
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
};

//County Outlines
export const CountyOutlineStyle = {
  id: "county-data",
  type: "fill",
  source: "CountyBoundaries",
  paint: {
    "fill-color": "rgba(0,0,0,0.1)",
    "fill-outline-color": "rgba(0,0,0,0.6)",
  },
  minzoom: 5.5,
};

//County Deaths
export const CountyDeathStyle = {
  id: "county-data",
  type: "fill",
  source: "CountyBoundaries",
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
    // change opacity on hover, default to 50% opacity
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
};