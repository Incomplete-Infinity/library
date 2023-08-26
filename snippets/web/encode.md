# `encode()`

## Summary

### Code

```js
const ss = SpreadsheetApp.getActive();

/**
 * This function encodes the values in the active range of a Google Sheets document using
 * encodeURIComponent.
 * @param {GoogleAppsScript.Spreadsheet.Range} [active=SpreadsheetApp.getActiveRange()] The range to encode.
 * function. If it is not provided, the function will use the currently active range in the Google
 * Sheets as the input range to encode. If it is provided, it should be a Range object that represents
 * the input
 */
const encode = (active = ss.getActiveRange()) => {
  const sheet = SpreadsheetApp.getActiveSheet();
  const values = active.getValues().map(([source]) => [encodeURIComponent(source.toString())]);
  sheet
    .getRange(active.getRow(), active.getColumn() + 1, active.getNumRows(), 1)
    .setValues(values);

  // Browser.msgBox("Encoded: "+ active);
};
```
