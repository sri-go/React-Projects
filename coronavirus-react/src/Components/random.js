// This is figuring out the difference between each days reported total cases
//Will return the difference between each day in 2 week period
const diff = tempObj[countyName]
  .slice(1)
  .map((value, index) => value - tempObj[countyName][index]);
console.log(diff);
obj[countyName].totalCases = totalCases;
obj[countyName].lastTwoWeeks = lastTwoWeeks;
console.log(obj);

// Calculate 14 Day Sum For All Counties
let sum = 0;
obj[countyName]["lastTwoWeeks"].map((value) => {
  // console.log(value)
  sum = sum + parseInt(value["y"]);
});
top10[countyName] = sum;
obj[countyName].sevenDaySum = sum;

// // Calculate 14 Day Sum For All Counties
// let sum = 0;
// obj[countyName]["lastTwoWeeks"].map((value) => {
//   // console.log(value)
//   sum = sum + parseInt(value["y"]);
// });
// top10[countyName] = sum;
// obj[countyName].sevenDaySum = sum;

// let result = Object.keys(top10)
//   .sort((a, b) => top10[b] - top10[a])
//   .slice(0, 10)
//   .map((value) => {
//     // console.log(obj[value]);
//   });
// return { data: obj, top10: result };
