# `timestamp()`

## Summary

### Code

```js
/**
 * @const timestamp
 * @summary The function returns a timestamp in ISO 8601 format with the current date and time in UTC.
 * @description Assembles and returns a timestamp string in the format of "yyyy-MM-ddThh:mm:ssZ", where "yyyy" is the year, "MM" is the month, "dd" is the day, "hh" is the hour, "mm" is the minute, "ss" is the second, and "Z" indicates that the timestamp is in UTC time.
 * @returns {string}
 */
const timestamp = () => {
  // get the current moment...
  const today = new Date();
  // get the year in 'yyyy' format..
  const year = today
    .getUTCFullYear()
    .toLocaleString("en-US", { minimumIntegerDigits: 4, useGrouping: false });
  // get the month in 'MM' format...
  const month = today
    .getUTCMonth() + (1)
    .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
  // get the day in 'dd' format...
  const day = today
    .getUTCDate()
    .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
  // get the hour in 'hh' format...
  const hour = today
    .getUTCHours()
    .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
  // get the minute in 'mm' format...
  const minute = today
    .getUTCMinutes()
    .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
  // get the second in 'ss' format...
  const second = today
    .getUTCSeconds()
    .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });

  // assemble the date string...
  const date = `${year}-${month}-${day}`;
  // assemble the time string
  const time = `${hour}:${minute}:${second}`;

  // return the strings together in a timestamp
  return `${date}T${time}Z`;
};
```
