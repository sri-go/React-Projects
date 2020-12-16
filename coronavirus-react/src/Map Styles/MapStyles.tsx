// State Death Styles
export const StateDeathStyle = {
  id: "states-data",
  type: "fill",
  source: "StatesBoundaries",
  layout: {
    // make layer visible by default
    visibility: "visible",
  },
  paint: {
    "fill-color": {
      //red colors
      stops: [
        [0, "#FFE3C5"],
        [5000, "#F5BFA2"],
        [10000, "#E59E82"],
        [50000, "#D07E66"],
        [100000, "#B8614D"],
        [250000, "#9B4736"],
        [500000, "#7D2F23"],
        [750000, "#5C1A13"],
        [1000000, "#3C0902"],
      ],
      property: "Confirmed",
      type: "interval",
      colorSpace: "rgb",
    },
    //change opacity on hover, default to 50% opacity
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      1,
      0.8,
    ],
  },
  maxzoom: 4.5,
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
  layout: {
    // make layer visible by default
    visibility: "visible",
  },
  paint: {
    "fill-color": {
      //paint colors
      stops: [
        [0, "#FFE3C5"],
        [100, "#F5BFA2"],
        [500, "#E59E82"],
        [1000, "#D07E66"],
        [5000, "#B8614D"],
        [10000, "#9B4736"],
        [50000, "#7D2F23"],
        [75000, "#5C1A13"],
        [100000, "#3C0902"],
      ],
      property: "Confirmed",
      type: "interval",
      colorSpace: "rgb",
    },
    // change opacity on hover, default to 50% opacity
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      1,
      0.8,
    ],
  },
  minzoom: 4.5,
};

//Two-Week State Confirmed Style
export const StateTwoWeekConfirmedStyle = {
  id: "StateTwoWeek-ConfirmedData",
  type: "fill",
  source: "StatesBoundaries",
  layout: {
    // make layer visible by default
    visibility: "none",
  },
  paint: {
    "fill-color": {
      //red colors
      stops: [
        [500, "#c5f7ff"],
        [1000, "#ace0ec"],
        [5000, "#94cad9"],
        [10000, "#7cb4c6"],
        [25000, "#669eb4"],
        [50000, "#4f89a2"],
        [100000, "#397490"],
        [250000, "#21607e"],
        [500000, "#004c6d"],
      ],
      property: "TwoWeekTotal",
      type: "interval",
      colorSpace: "rgb",
    },
    //change opacity on hover, default to 50% opacity
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      1,
      0.8,
    ],
  },
  maxzoom: 4.5,
};

//Two-Week County Confirmed Style
export const CountyTwoWeekConfirmedStyle = {
  id: "CountyTwoWeek-ConfirmedData",
  type: "fill",
  source: "CountyBoundaries",
  layout: {
    // make layer hidden by default
    visibility: "none",
  },
  paint: {
    "fill-color": {
      //blue colors
      stops: [
        [0, "#c5f7ff"],
        [50, "#ace0ec"],
        [100, "#94cad9"],
        [500, "#7cb4c6"],
        [1000, "#669eb4"],
        [2500, "#4f89a2"],
        [5000, "#397490"],
        [10000, "#21607e"],
        [15000, "#004c6d"],
      ],
      property: "TwoWeekTotal",
      type: "interval",
      colorSpace: "rgb",
    },
    //change opacity on hover, default to 50% opacity
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      1,
      0.8,
    ],
  },
  minzoom: 4.5,
};


