/**
 * @function
 * @alias prepareSheet
 * @summary Creates a new sheet or clears an existing sheet if it already exists.
 * @param {string} sheetName - Name of Sheet (tab name)
 * @returns {object} - The Prepared Sheet
 */
async function prepareSheet(sheetName = false) {
  console.time(`Prepared the sheet named ${sheetName} in `);
  let result;
  try {
    if (sheetName) {
      const ss = SpreadsheetApp;
      const workBook = await ss.getActiveSpreadsheet();
      sheet = await workBook.getSheetByName(sheetName);

      if (sheet != null) {
        await sheet.clearContents();
      } else {
        result = await workBook.insertSheet();
        await result.setName(sheetName);
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