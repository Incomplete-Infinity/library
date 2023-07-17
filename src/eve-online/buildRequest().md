# `buildRequest()`

## Summary

### Code

```js
/**
 * This function builds and sends multiple requests to retrieve market history data for specific item
 * types in a specific region using the GESI library in JavaScript.
 */
function buildRequest() {
  var client = GESI.getClient().setFunction(`markets_region_history`);

  var type_ids = [34, 35, 36];
  var requests = type_ids.map((type_id) => {
    return client.buildRequest({
      type_id: type_id,
      region_id: 10000002
    });
  });
  Logger.log(requests);
  var responses = UrlFetchApp.fetchAll(requests);

  Logger.log(responses);
}
```
