# `cropSheet()`

## Summary

### Code

```js
/**
 * Deletes any blank columns in a given sheet, leaving a minimum number of columns.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet to crop.
 * @param {number} [minCols=0] - The minimum number of columns to leave in the sheet.
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} The cropped sheet.
 */
const cropCols = (sheet, minCols = 0) => {
  // Get the range of the sheet
  const range = sheet.getDataRange();
  // Get the index of the last column in the range
  const lastColumn = range.getLastColumn();
  // Get the total number of columns in the range
  const maxColumns = range.getNumColumns();
  // If the number of columns in the sheet is not equal to the number of columns in the range
  if (maxColumns !== lastColumn) {
    // Calculate the number of blank columns to delete
    const numColsToDelete = maxColumns - Math.max(lastColumn, minCols);
    // If there are blank columns to delete
    if (numColsToDelete > 0) {
      // Delete the blank columns
      sheet.deleteColumns(lastColumn + 1, numColsToDelete);
    }
  }
  // Return the cropped sheet
  return sheet;
};

/**
 * Deletes any blank rows in a given sheet, leaving a minimum number of rows.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet to crop.
 * @param {number} [minRows=2] - The minimum number of rows to leave in the sheet.
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} The cropped sheet.
 */
const cropRows = (sheet, minRows = 2) => {
  // Get the range of the sheet
  const range = sheet.getDataRange();
  // Get the index of the last row in the range
  const lastRow = range.getLastRow();
  // Get the total number of rows in the range
  const maxRows = range.getNumRows();
  // If the number of rows in the sheet is not equal to the number of rows in the range
  if (maxRows !== lastRow) {
    // Calculate the number of blank rows to delete
    const numRowsToDelete = maxRows - Math.max(lastRow, minRows);
    // If there are blank rows to delete
    if (numRowsToDelete > 0) {
      // Delete the blank rows
      sheet.deleteRows(lastRow + 1, numRowsToDelete);
    }
  }
  // Return the cropped sheet
  return sheet;
};

/**
 * Crops a given sheet by deleting any blank rows or columns, leaving a minimum number of rows and columns.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} [sheet=false] - The sheet to crop.
 * @param {number} [minCols=2] - The minimum number of columns to leave in the sheet.
 * @param {number} [minRows=2] - The minimum number of rows to leave in the sheet.
 * @returns {GoogleAppsScript.Spreadsheet.Sheet|null} The cropped sheet or null if sheet is not defined.
 */
const cropSheet = (sheet = false, minCols = 2, minRows = 2) => {
  console.time(`Executed "cropSheet()" in`); // Start a timer to measure execution time
  if (!sheet) {
    console.error(`Required parameter "sheet" is not defined.`);
    return null;
  }
  cropCols(sheet, minCols);
  cropRows(sheet, minRows);
  console.timeEnd(`Executed "cropSheet()" in`);
  // Return the cropped sheet
  return sheet;
}
```
