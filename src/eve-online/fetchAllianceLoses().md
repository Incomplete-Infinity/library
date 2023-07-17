# `fetchAllianceLosses()`

## Summary

### Code

```js
/**
 * This function fetches all losses for a given alliance ID from the zKillboard API.
 * @param [allianceID=99011193] - The allianceID parameter is the unique identifier for an alliance in
 * the game EVE Online. It is used in the zKillboard API to retrieve information about losses (ships
 * destroyed) for a specific alliance.
 * @returns the result of a URL fetch request to the zKillboard API for all losses of a specified
 * alliance ID.
 */
function fetchAllianceLosses(allianceID = 99011193) {
  return cacheUrlFetchApp(`https://zkillboard.com/api/losses/allianceID/${allianceID}/`);
}
```
