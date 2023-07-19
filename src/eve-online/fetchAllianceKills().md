# `fetchAllianceKills()`

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Summary

### Code

```js
/**
 * This function fetches all kills for a given alliance ID from the zKillboard API.
 * @param [allianceID=99011193] - The ID of the alliance for which you want to fetch the kills data
 * from the zKillboard API. The default value is set to 99011193, which is the alliance ID for Pandemic
 * Horde in EVE Online.
 * @returns The function `fetchAllianceKills_` is returning the result of a URL fetch request to the
 * zKillboard API for all kills made by the specified alliance ID. The result could be a JSON object
 * containing information about the kills made by the alliance.
 */
function fetchAllianceKills(allianceID = 99011193) {
  return cacheUrlFetchApp(`https://zkillboard.com/api/kills/allianceID/${allianceID}/`);
}
```
