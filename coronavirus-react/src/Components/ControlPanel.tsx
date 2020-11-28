import React, { useState, useEffect } from "react";

interface ControlPanelProps {
  mapRef: any;
}

const ControlPanel = (props: ControlPanelProps) => {
  const layers = {
    "states-data": { visibility: "visible" },
    "county-data": { visibility: "visible" },
  };
  const { mapRef } = props;

  const onClick = (e: React.SyntheticEvent) => {
    const map = mapRef.current.getMap();
    const isVisible = map.getLayoutProperty("states-data", "visibility");

    isVisible === "visible"
      ? map.setLayoutProperty("states-data", "visibility", "none") &&
        map.setLayoutProperty("county-data", "visibility", "none") &&
        map.setLayoutProperty(
          "StateTwoWeek-ConfirmedData",
          "visibility",
          "visible"
        ) &&
        console.log(
          map.getLayoutProperty("StateTwoWeek-ConfirmedData", "visibility")
        )
      : map.setLayoutProperty("states-data", "visibility", "visible") &&
        map.setLayoutProperty("county-data", "visibility", "visible") &&
        map.setLayoutProperty(
          "StateTwoWeek-ConfirmedData",
          "visibility",
          "none"
        ) &&
        console.log(
          map.getLayoutProperty("StateTwoWeek-ConfirmedData", "visibility")
        );

  };

  return (
    <div style={{ position: "fixed", bottom: "30px", left: "10px" }}>
      <button onClick={onClick}>
        Toggle Total Cases {layers["states-data"].visibility}
      </button>
      {/* <button onClick={onClick}>
        Toggle Last Two Weeks {layers["county-data"].visibility}
      </button> */}
    </div>
  );
};

export default ControlPanel;
