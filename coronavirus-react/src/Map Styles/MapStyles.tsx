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
        [1000, "#F9C6A8"],
        [5000, "#EFAA8E"],
        [10000, "#E28F75"],
        [25000, "#D0765F"],
        [50000, "#BC5E4B"],
        [100000, "#A64839"],
        [250000, "#8E3429"],
        [500000, "#74221B"],
        [750000, "#59120F"],
        [1000000, "#3F0501"],
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
      //paint colors 
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
      property: "Confirmed",
      type: 'interval',
      colorSpace:'rgb'
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

//Two-Week Confirmed Style
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
        [0, "#FCDDC0"],
        [1000, "#F2BB9E"],
        [5000, "#E29A80"],
        [10000, "#CE7B64"],
        [25000, "#B65F4C"],
        [50000, "#9A4536"],
        [100000, "#7C2E24"],
        [250000, "#5D1A14"],
        [500000, "#3D0903"],
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
      0.5,
    ],
  },
  maxzoom: 5.5,
};


