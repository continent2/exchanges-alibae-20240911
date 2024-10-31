const getaverage = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;
const getmedian = (arr) => {
  if (arr.length === 0) throw new Error('No inputs');
  arr.sort(function (a, b) {
    return a - b;
  });
  var half = Math.floor(arr.length / 2);
  if (arr.length % 2) {
    return arr[half];
  }
  return (arr[half - 1] + arr[half]) / 2.0;
};
const cumulativeSum = (
  (sum) => (value) =>
    (sum += value)
)(0);
const cum_sum_arr_not_working = (arr) => {
  return arr.map(cumulativeSum);
};
const cum_sum_arr = (arr) => {
  return arr.reduce(function (r, a) {
    r.push(((r.length && r[r.length - 1]) || 0) + a);
    return r;
  }, []);
}
const getstatsofarray = (arr) => {
  if (arr && arr.length) {
  } else {
    return null;
  }
  return {
    // open : arr[0] 		,
    max: Math.max(...arr),
    min: Math.min(...arr),
    //		, close : arr[arr.length-1]
    average: getaverage(arr),
    count: arr.length,
  };
};
const getrandomelementfromarray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

module.exports = {
  getaverage,
  getmedian,
  cum_sum_arr,
  getstatsofarray,
  getrandomelementfromarray,
};
