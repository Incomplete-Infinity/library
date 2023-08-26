# `contractsAppraisal()`

## Summary

### Code

```js
/**
 * The function `contractAppraisal` takes in several parameters and constructs a URL for an API request
 * to the Contracts Appraisal service.
 * @requires https://api.contractsappraisal.com
 * @param [typeId=1296] - The ID of the item type being appraised.
 * @param [includePrivate=false] - a boolean value indicating whether to include private contracts in
 * the appraisal or not. Default is false.
 * @param [includeBpc=false] - A boolean value indicating whether or not to include Blueprint Copies
 * (BPCs) in the appraisal.
 * @param [security] - The security level of the location where the appraisal is being done. It has a
 * default value of "highsec" which stands for high security space in the game EVE Online. Other
 * possible values are "lowsec" and "nullsec".
 * @param [materialEfficiency=0] - A number representing the material efficiency level of the item
 * being appraised. Defaults to 0 if not provided.
 * @param [timeEfficiency=0] - A number representing the time efficiency level of the item being
 * appraised. It has a default value of 0.
 */
function contractAppraisal(
  typeId = 1296,
  includePrivate = false,
  includeBpc = false,
  security = `highsec`,
  materialEfficiency = 0,
  timeEfficiency = 0
) {
  const domain = `https://api.contractsappraisal.com`;
  const endPoint = `/v1/prices/`;
  console.log(arguments);
  const parameters = [
    `include_private=${includePrivate}`,
    `bpc=${includeBpc}`,
    `security=${security}`,
    `material_efficiency=${materialEfficiency}`,
    `time_efficiency=${timeEfficiency}`,
  ];
  const query = `?1`;

  const url = `${domain}${endPoint}${query}`;
  console.log(url);
}
```
