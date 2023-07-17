# `buildRequest()`

## Summary

### Code

```js
/**
 * This function builds and sends multiple requests to retrieve market history data for specific item
 * types in a specific region using the GESI library in JavaScript.
 */
function buildRequest(typeIds, regionId = 10000002) {
  typeIds = extractIds(typeIds);

  const client = GESI.getClient().setFunction(`markets_region_history`);
  const requests = typeIds.map((typeId) => client.buildRequest({
      type_id: typeId,
      region_id: regionId
    })
  );
  log(requests);
  const responses = UrlFetchApp.fetchAll(requests);
  log(responses);

  return responses;
}
```
