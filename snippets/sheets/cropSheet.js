/**
 * Crops the given sheet such that it only contains data.
 * @param {GoogleAppsScript.SpreadsheetApp.sheet} sheet The sheet to crop.
 */
function cropSheet(sheet) {
  const range = sheet.getDataRange();
  const firstRow = range.getRow();
  const lastRow = firstRow + range.getNumRows() - 1;
  const firstColumn = range.getColumn();
  const lastColumn = firstColumn + range.getNumColumns() - 1;
  const maxRows = sheet.getMaxRows();
  const maxColumns = sheet.getMaxColumns();

  (lastRow < maxRows) && sheet.deleteRows(lastRow + 1, maxRows - lastRow);
  (firstRow > 1) && sheet.deleteRows(1, firstRow - 1);
  (lastColumn < maxColumns) && sheet.deleteColumns(lastColumn + 1, maxColumns - lastColumn);
  (firstColumn > 1) && sheet.deleteColumns(1, firstColumn - 1);
}
