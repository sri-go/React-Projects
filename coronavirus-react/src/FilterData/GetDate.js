//This function gets the date and returns an url to the most recent version of the data file
//Returns the date updated as well
function getDate() {
  var today = new Date();
  var priorDate = new Date().setDate(today.getDate() - 1);
  var priorDateTs = new Date(priorDate);
  // var yesterday = priorDateTs.toISOString();
  var day = priorDateTs.getDate();
  var month = priorDateTs.getMonth() + 1;
  var year = priorDateTs.getFullYear();

  if (month <= 9) {
    month = "0" + month;
  } else {
    month + 1;
  }

  // formatting day so it is able to parse the correct date on github data server
  if (day < 10) {
    day = "0" + day;
  } else {
    day = day;
  }

  var url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${month}-${day}-${year}.csv`;
  return { url: url, date: priorDateTs.toLocaleDateString() };
}
