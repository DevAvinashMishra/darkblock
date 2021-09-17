export const getFormattedDateFromMillis = (millis) => {
  var result = "";
  var d = new Date(parseInt(millis));
  result += d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  return result;
};
