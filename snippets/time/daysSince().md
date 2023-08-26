# `daysSince()`

## Summary

### Code

```js
/**
 * The function calculates the number of days between a given date and the current date.
 * @param date - The date parameter is a Date object representing a specific date and time.
 * @returns The function `daysSince` returns the number of days between the input `date` and the
 * current date.
 */
function daysSince(date) {
	return (date - new Date()) / (1000 * 3600 * 24);
}
```
