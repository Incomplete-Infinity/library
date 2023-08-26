# `cacheUrlFetchApp()`

## Summary

### Code

```js
/**
 * @constant
 * @name cacheUrlFetchApp
 * @alias cacheUrlFetchApp
 * @summary Handles caching for http requests
 * @description  Checks if the return from a Url fetch is in cache. If so, it retrieves it from cache instead of making another network request. If not, it makes a new request and adds it to the cache
 * @param   {String}  fetchUrl    - The URL to be fetched and cached.
 * @param   {Object} [parameters]  - An optional object parameter that contains the method and payload to be used
 * @return the result of the Url fetch, either from the cache or by making a network request.
 */
const cacheUrlFetchApp = (
  fetchUrl,
  parameters = { method: `get`, payload: `` }
) => {
  const { fetch } = UrlFetchApp;
  // Set up public cache
  const cache = CacheService.getScriptCache();
  // Turn the requested Url into a string based on the MD5
  const digest = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, fetchUrl));
  // Based on this MD5, lookup the Url in the cache
  const cached = cache.get(digest);
  // If a result has been already cached, use it
  if (cached != null) {
    return cached;
  }
  // Make the network requests at random intervals to avoId server overload
  Utilities.sleep(Math.random() * 1000 * 5);
  // Fetch the Url
  const resultXML = fetch(fetchUrl, parameters);
  // Get the text of the Url call
  const result = resultXML.getContentText();
  // Cache the result in chunks
  const chunkSize = 100000; // 100KB
  for (let i = 0; i < result.length; i += chunkSize) {
    cache.put(`${digest}_${i}`, result.substring(i, i + chunkSize), 21600);
  }

  // return the result
  return result;
};
```
