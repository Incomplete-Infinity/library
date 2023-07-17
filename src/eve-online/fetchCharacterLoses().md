# `fetchCharacterLosses()`

```js

## Summary

### Code
/**
 * This function fetches the losses of a specific character from the zKillboard API.
 * @param [characterID=2113672280] - The characterID parameter is the unique identifier for a specific
 * character in the game. It is used in the URL to fetch the losses (ships destroyed) for that
 * particular character from the zKillboard API.
 * @returns The function `fetchCharacterLosses_` is returning the result of a URL fetch request to the
 * zKillboard API for the losses of a specific character ID. The function is using a custom
 * `cacheUrlFetchApp` function to cache the results of the API request.
 */
function fetchCharacterLosses(characterID = 2113672280) {
  return cacheUrlFetchApp(`https://zkillboard.com/api/losses/characterID/${characterID}/`);
}
```
