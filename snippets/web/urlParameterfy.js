const ss = SpreadsheetApp.getActive();

/**
 * Encodes the input data in the given range as a URI component.
 * @param {GoogleAppsScript.Spreadsheet.Range} [active=SpreadsheetApp.getActiveRange()] The range to encode.
 */
const encode = (active = ss.getActiveRange()) => {
  const sheet = SpreadsheetApp.getActiveSheet();
  const values = active.getValues().map(([source]) => [encodeURIComponent(source.toString())]);
  sheet
    .getRange(active.getRow(), active.getColumn() + 1, active.getNumRows(), 1)
    .setValues(values);

  // Browser.msgBox("Encoded: "+ active);
};

/**
 * Decodes the input data in the given range from a URI component.
 * @param {GoogleAppsScript.Spreadsheet.Range} [active=SpreadsheetApp.getActiveRange()] The range to decode.
 */
const decode = (active = ss.getActiveRange()) => {
  const sheet = SpreadsheetApp.getActiveSheet();
  const values = active.getValues().map(([source]) => [decodeURIComponent(source.toString().replace(/\+/g, ' '))]);
  sheet
    .getRange(active.getRow(), active.getColumn(), active.getNumRows(), 1)
    .setValues(values);

  // Browser.msgBox("Decoded: "+ active);
};

