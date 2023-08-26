# `cardinalToOrdinal()`

## Summary

### Code

```js
/**
 * The function converts a cardinal number to its corresponding ordinal form.
 * @param numeral - The parameter "numeral" represents a cardinal number (e.g. 1, 2, 3, 4, 5, etc.)
 * that needs to be converted to its corresponding ordinal form (e.g. 1st, 2nd, 3rd, 4th
 * @returns A string representing the ordinal form of the input numeral.
 */
async function cardinalToOrdinal(numeral) {
  if (numeral > 3 && numeral < 21) return await `${numeral}th`;
  switch (numeral % 10) {
    case 1:
      return await `${numeral}st`;
    case 2:
      return await `${numeral}nd`;
    case 3:
      return await `${numeral}rd`;
    default:
      return await `${numeral}th`;
  }
}
```
