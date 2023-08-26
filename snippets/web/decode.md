# `decode()`

## Summary

### Code

```js
const ss = SpreadsheetApp.getActive();

/**
 * This function decodes URL-encoded strings in a Google Sheets cell.
 * @param {GoogleAppsScript.Spreadsheet.Range} [active=SpreadsheetApp.getActiveRange()] The range to decode.
 * in a Google Sheets spreadsheet. If no range is specified, it defaults to the currently active range.
 * The `active` parameter is used in the `decode` function to get the values of the active range and
 * decode any encoded characters
 */
const decode = (active = ss.getActiveRange()) => {
  const sheet = SpreadsheetApp.getActiveSheet();
  const values = active.getValues().map(([source]) => [decodeURIComponent(source.toString().replace(/\+/g, ' '))]);
  sheet
    .getRange(active.getRow(), active.getColumn(), active.getNumRows(), 1)
    .setValues(values);

  // Browser.msgBox("Decoded: "+ active);
};
```
