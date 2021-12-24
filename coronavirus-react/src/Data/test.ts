const cleanStateData = (
  data: Array<Object>,
  dataName: string,
  callback: (Total: Object) => void
) => {
  const featuresArr = StatesBoundaries.features;

  if (dataName === "Confirmed") {
    let USConfirmedTotal = 0;
  } else {
    let USDeathsTotal = 0;
  }

  let USConfirmedTotal = 0;
  data.map((dataFeature: any, index: number) => {
    featuresArr.find((feature: any) => {
      // initally check if the property exists
      if (!feature.properties.Confirmed) {
        feature.properties.Confirmed = 0;
      }
      if (!feature.properties.TwoWeekTotal) {
        feature.properties.TwoWeekTotal = 0;
      }
      if ((feature.properties.name = dataFeature.Province_State)) {
        USConfirmedTotal += dataFeature.Confirmed;
        feature.properties["Confirmed"] += parseInt(dataFeature.Confirmed);
        feature.properties["TwoWeekTotal"] += parseInt(
          dataFeature.TwoWeekTotal
        );
      }
    });
  });
};
