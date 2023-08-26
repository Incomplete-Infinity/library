# `autoUpdateDate()`

## Summary

### Code

```js
const sheetName = `Sheet1`;
const timestampHeader = `timestamp`;

/**
 * This function retrieves the column index of a timestamp header in a Google Sheets spreadsheet.
 * @returns the index of the column that contains the timestamp header in the active spreadsheet. The
 * index is incremented by 1 to match the column numbering used in Google Sheets (which starts at 1
 * instead of 0).
 */
function getDatetimeCol() {
  const headers = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName).getDataRange().getValues().shift();
  const colIndex = headers.indexOf(timestampHeader);
  return colIndex + 1;
}

/**
 * This function automatically adds a timestamp to a specific column in a Google Sheets document when a
 * cell in another column is edited.
 * @param e - The "e" parameter in this function refers to the event object that triggered the onEdit
 * function. It contains information about the edit event, such as the range of cells that were edited
 * and the user who made the edit.
 */
function onEdit(e) {
  const ss = SpreadsheetApp.getActiveSheet();
  const cell = ss.getActiveCell();
  const datecell = ss.getRange(cell.getRowIndex(), getDatetimeCol());
  if (ss.getName() == SHEET_NAME && cell.getColumn() == 1 && !cell.isBlank() && datecell.isBlank()) {
    datecell.setValue(new Date()).setNumberFormat("yyyy-MM-dd hh:mm");
  }
}
```
