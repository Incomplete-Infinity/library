# `getServerPrices()`

## Summary

### Code

```js
/**
 * The function retrieves industry prices for items in the game EVE Online and returns them in a sorted
 * array, with the option to include headers.
 * @param [showHeaders=true] - A boolean parameter that determines whether or not to include headers in
 * the returned data. If set to true, the function will return an array with headers as the first
 * element and the prices as subsequent elements. If set to false, the function will only return the
 * prices array.
 * @returns The function `getIndustryPrices` returns an array of arrays containing the `Type ID`,
 * `Average Price`, and `Adjusted Price` for each item in the EVE Online game, sorted by `Type ID`. The
 * first array in the returned array contains the headers for each column (`Type ID`, `Average Price`,
 * `Adjusted Price`) if `showHeaders` is set to `true`.
 */
function getIndustryPrices(showHeaders = true) {
  const headers = [`Type ID`, `Average Price`, `Adjusted Price`];
  const url = `https://esi.evetech.net/latest/markets/prices/?datasource=tranquility`;
  const options = { method: `GET` };
  const response = UrlFetchApp.fetch(url, options);
  const code = response.getResponseCode();

  if (code !== 200) {
    throw new Error(`Failed to fetch prices
    Response Code: ${code}`);
  }

  const content = response.getContentText();
  const json = JSON.parse(content);
  const prices = json
    .map((item) => [item.type_id, item.average_price, item.adjusted_price])
    .sort((a, b) => a[0] - b[0]);

  return showHeaders ? [headers, ...prices] : prices;
}
```
