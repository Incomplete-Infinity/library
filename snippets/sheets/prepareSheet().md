# `prepareSheet()`

## Summary

### Code

```js
/**
 * @function
 * @alias prepareSheet
 * @summary Creates a new sheet or clears an existing sheet if it already exists.
 * @param {string} sheetName - Name of Sheet (tab name)
 * @returns {object} - The Prepared Sheet
 */
function prepareSheet(sheetName = false) {
  console.time(`Prepared the sheet named ${sheetName} in `);
  let result;
  try {
    if (sheetName) {
      const ss = SpreadsheetApp;
      const workBook = ss.getActiveSpreadsheet();
      sheet = workBook.getSheetByName(sheetName);

      if (sheet != null) {
        sheet.clearContents();
      } else {
        result = workBook.insertSheet();
        result.setName(sheetName);
      }
    } else {
      throw new Error(`Required parameter, "sheetName" is not defined.`);
    }
  } catch (error) {
    console.error(`Failed to execute "prepareSheet()!
      Error Message: ${error.message}`);
  } finally {
    console.timeEnd(`Prepared the sheet named ${sheetName} in `);
    return result;
  }
}
```
