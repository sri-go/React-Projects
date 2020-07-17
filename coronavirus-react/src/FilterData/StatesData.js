//This function downloads the CSV File data, adds it to GEOJSON file, and then Filters it for the US State Subsect,
var get_states_data = function (url) {
  var download = $.ajax({
    url: url,
  });
  var combined_promise = download.done(function (downloaded_data) {
    if (typeof downloaded_data !== "undefined") {
      csv2geojson.csv2geojson(downloaded_data, function (err, data) {
        var us_subsect = filter_us_data(data);
        var calc_total = calc_totals(us_subsect);
        var combined_data = combine_files(calc_total);
        // console.log(combined_data);
      });
    }
  });
  //State Level Data
  //filtering for only usa data at state level
  //also removing some misc data that has USA listed as its country
  var filter_us_data = function (data) {
    var us_subsect = [];
    _.map(data.features, function (feature) {
      // var not_in = ['Grand Princess', 'Diamond Princess', 'Wuhan Evacuee', 'Recovered'];
      // // console.log(not_in.indexOf(feature.properties.Province_State));
      // // console.log(feature.properties)
      // // if(feature.properties.)
      // if (not_in.indexOf(feature.properties.Province_State) >= 0) {
      //     delete feature;
      // }
      // console.log(feature)
      if (feature.properties["Country_Region"] === "US") {
        us_subsect.push(feature);
      }
    });
    // console.log(us_subsect);
    return us_subsect;
  };
  //reduce function boils list down to one number for each state
  //utilizing it here to get one total for each state
  var calc_totals = function (us_subsect_data) {
    // console.log(us_subsect_data)
    //calculate totals for each state;
    var confirmed_state_total = _.reduce(
      us_subsect_data,
      function (memo, item) {
        memo[item.properties.Province_State] =
          (memo[item.properties.Province_State] || 0) +
          parseInt(item.properties.Confirmed);
        return memo;
      },
      {}
    );
    // console.log(confirmed_state_total);
    var death_state_total = _.reduce(
      us_subsect_data,
      function (memo, item) {
        memo[item.properties.Province_State] =
          (memo[item.properties.Province_State] || 0) +
          parseInt(item.properties.Deaths);
        return memo;
      },
      {}
    );
    // console.log(death_state_total);
    var recovered_state_total = _.reduce(
      us_subsect_data,
      function (memo, item) {
        memo[item.properties.Province_State] =
          (memo[item.properties.Province_State] || 0) +
          parseInt(item.properties.Recovered);
        return memo;
      },
      {}
    );
    // console.log(recovered_state_total);
    var total_death_us = 0;
    var count = 1;
    var us_death_total = _.each(death_state_total, function (state) {
      // console.log(death_state_total);
      // console.log(count);
      count += 1;
      total_death_us = total_death_us + state;
    });
    // console.log(total_death_us);
    var total_confirmed_us = 0;
    var us_confirmed_total = _.each(confirmed_state_total, function (state) {
      // console.log(state);
      total_confirmed_us = total_confirmed_us + state;
    });
    // console.log(total_confirmed_us);
    return {
      confirmed_state_total: confirmed_state_total,
      death_state_total: death_state_total,
      recovered_state_total: recovered_state_total,
      us_death_total: total_death_us,
      us_confirmed_total: total_confirmed_us,
    };
  };
  //combining data back to one file
  var combine_files = function (data_totals) {
    //add COVID-19 data to the states.js file
    state_boundaries.us_death_total = data_totals.us_death_total;
    state_boundaries.us_confirmed_total = data_totals.us_confirmed_total;
    // console.log(state_boundaries.us_death_total);
    var combined = _.each(state_boundaries.features, function (state_feature) {
      var state = state_feature.properties.name;
      state_feature.properties.Confirmed =
        data_totals["confirmed_state_total"][state];
      state_feature.properties.Deaths = data_totals["death_state_total"][state];
      state_feature.properties.Recovered =
        data_totals["recovered_state_total"][state];
      delete state_feature.properties.density;
    });
    //  console.log(state_boundaries);
    return combined;
  };
  return combined_promise;
};
