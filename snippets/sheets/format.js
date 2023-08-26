function invTypesImport() {
  const ss = SpreadsheetApp;
  const spreadsheet = ss.getActive();
  const url = `https://www.fuzzwork.co.uk/dump/latest/`;
  const csvSheets = [
    {
      sheet: `invTypes`,
      headers: [
        `typeID`,
        `groupID`,
        `typeName`,
        `description`,
        `mass`,
        `volume`,
        `capacity`,
        `portionSize`,
        `raceID`,
        `basePrice`,
        `published`,
        `marketGroupID`,
        `iconID`,
        `soundID`,
        `graphicID`,
      ],
    },
  ];

  /*************************************************************
   * @param {*} sheet Name of the Sheet (aka Tab)          *
   * @param {*} csvFile Name of SDE to download from Fuzzworks *
   *************************************************************/
  function buildSDEs(SdePage) {
    /*******************************************************************
     * Fetches a csvFile                                               *
     * @param {*} csvFile  Expected String, Name of .csv file to fetch *
     * @returns contents of csvFile                                    *
     *******************************************************************/
    const getCSVData = ({ sheet }) => {
      //start timer
      console.time(`Time to load ${sheet}.csv into sheet: `);
      //assembles the url for the .csv file.
      let csvURL = `${url}${sheet}.csv`;
      //fetches the .csv file
      const csvContent = UrlFetchApp.fetch(csvURL).getContentText();
      //end timer
      console.timeEnd(`Time to load ${sheet} into sheet: `);
      return csvContent;
    };

    /*******************************************************************
     * Creates a blank sheet or resets Existing sheet                  *
     * @param {*} sheet  Expected String, Name of Sheet (tab name) *
     * @returns Blank Sheet                                            *
     *******************************************************************/
    const prepareSheet = (sheet) => {
      //start timer for preparing the sheet
      console.time(`prepareSheet({${typeof sheet}} ${sheet}})`);

      //start timer for updating the sheet
      console.time(`Time to prepare a sheet named ${sheet}: `);

      //check if a sheet name is provided
      if (sheet === null || sheet === "") {
        throw `sheet name is required`;
      }
      let activeSheet = ss.getActiveSpreadsheet();
      let workSheet = activeSheet.getSheetByName(sheet);

      //found the Sheet, Clear it and Move on
      if (workSheet != null) {
        //clear the sheet
        workSheet.clearContents();
        //end timer
        console.timeEnd(`Time to prepare a sheet named ${sheet}: `);
        return workSheet;
      }
      //assume new sheet
      workSheet = activeSheet.insertSheet();
      workSheet.setName(sheet);
      cropSheet(workSheet);
      //end timer
      console.timeEnd(`prepareSheet({sheet: ${sheet}})`);
      return workSheet;
    };

    /*******************************************************************
     * Deletes unused portions of a spreadsheet and applies formatting *
     * @param {*} sheet  Expected String, Name of Sheet (tab name) *
     *******************************************************************/
    const formatSheet = (sheet) => {
      const numMaxRows = sheet.getMaxRows();
      const numMaxColumns = sheet.getMaxColumns();

      const numLastRow = sheet.getLastRow();
      const numLastColumn = sheet.getLastColumn();
      /*******************************************************************
       * Deletes unused portions of a spreadsheet                        *
       * @param {*} sheet  Expected String, Name of Sheet (tab name) *
       *******************************************************************/
      function cropSheet(sheet) {
        /*******************************************************************
         * Deletes unused columns of a spreadsheet                         *
         * @param {*} sheet  Expected String, Name of Sheet (tab name) *
         *******************************************************************/
        function deleteBlankColumns(sheet, numMinColumns = 2) {
          if (
            numMaxColumns - numLastColumn != 0 &&
            numLastColumn < numMinColumns
          ) {
            //save 2 columns on a new sheet
            sheet.deleteColumns(
              numMinColumns + 1,
              numMaxColumns - numMinColumns
            );
          } else if (
            numMaxColumns - numLastColumn != 0 &&
            numLastColumn > numMinColumns
          ) {
            sheet.deleteColumns(
              numLastColumn + 1,
              numMaxColumns - numLastColumn
            );
          }
        }

        /*******************************************************************
         * Deletes unused rows of a spreadsheet                            *
         * @param {*} sheet  Expected String, Name of Sheet (tab name) *
         *******************************************************************/
        function deleteBlankRows(sheet) {
          let maxRows = sheet.getMaxRows();
          let lastRow = sheet.getLastRow();
          if (maxRows - lastRow != 0) {
            if (lastRow < 2) {
              //save 2 columns on a new sheet
              lastRow = 2;
            }
            sheet.deleteRows(lastRow + 1, maxRows - lastRow);
          }
        }

        deleteBlankColumns(sheet);
        deleteBlankRows(sheet);
      }

      /*******************************************************************
       * Applies pre-set formatting options to a spreadsheet             *
       * @param {*} sheet  Expected String, Name of Sheet (tab name) *
       *******************************************************************/
      function applyFormatting(sheet) {
        const {
          getMaxColumns,
          getMaxRows,
          getRange,
          setFrozenRows,
          autoResizeColumns,
          setRowHeights,
        } = sheet;

        const maxColumns = sheet.getMaxColumns();
        const maxRows = sheet.getMaxRows();

        /**
         * Selects all cells
         */
        const selectAllCells = () => {
          return sheet.getRange(1, 1, maxRows, maxColumns);
        };
        /**
         * Selects the top row
         */
        const selectTopRow = () => {
          return spreadsheet.getRange("1:1");
        };

        /**
         * Selects all rows
         */
        const selectAllRows = () => sheet.getRange(1, maxRows);
        const selectRange = (range) => sheet.getRange(range);
        const selectDataRows = () => {
          return sheet.getRange("2:" + maxRows);
        };
        rngAllCells().clearFormat();

        sheet.setFrozenRows(1);

        //Set the column to auto resize
        sheet.autoResizeColumns(1, maxColumns);

        sheet.setRowHeights(1, maxRows, 22);

        selectAllCells().setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);

        selectTopRow()
          .setFontSize(12)
          .setFontFamily("Fira Sans")
          .setFontWeight("bold")
          .setHorizontalAlignment("center")
          .setBorder(
            null,
            null,
            true,
            null,
            null,
            null,
            "#000000",
            SpreadsheetApp.BorderStyle.SOLID
          );

        selectDataRows().setFontSize(11).setFontFamily("Fira Code");

        sheet
          .getRange("A2:B")
          .setNumberFormat("####")
          .setHorizontalAlignment("center");

        sheet.getRange("C2:D").setNumberFormat("@");

        sheet.getRange("E2:E").setHorizontalAlignment("right");

        sheet
          .getRange("F2:F")
          .setNumberFormat('#,##0.00"m³"')
          .setHorizontalAlignment("right");

        sheet
          .getRange("H2:I")
          .setNumberFormat("####")
          .setHorizontalAlignment("center");

        sheet
          .getRange("J2:J")
          .setNumberFormat("[$Ƶ]#,##0.00")
          .setHorizontalAlignment("left");

        sheet
          .getRange("K2:O")
          .setNumberFormat("####")
          .setHorizontalAlignment("center");

        rngAllRows().applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
      }
      cropSheet(sheet);
      applyFormatting(sheet);
    };

    /*******************************************************************
     * ref: http://stackoverflow.com/a/1293163/2343                    *
     * This will parse a delimited string into array of arrays. The    *
     * Default delimiter is "," if no second argument is declared.     *
     * @param {*} strData  Expected String, Stringified .csv file.     *
     * @param {*} strDelimiter  Expected String, delimiting character. *
     * @param {*} headers  Expected Array, columns to be output.       *
     *******************************************************************/
    const CSVToArray = (strData, strDelimiter = ",", headers = null) => {
      const skipHeaders =
        headers == null || headers.length == 0 || headers[0] == null;
      let headersIndex = [];

      // Check to see if the delimiter is defined. If not, default to comma.
      strDelimiter = strDelimiter || ",";

      // Create a regular expression to parse the CSV values.
      let objPattern = new RegExp(
        // Delimiters.
        "(\\" +
          strDelimiter +
          "|\\r?\\n|\\r|^)" +
          // Quoted fields.
          '(?:"([^"]*(?:""[^"]*)*)"|' +
          // google leading apostrophe
          //('+)
          // Standard fields.
          '([^"\\' +
          strDelimiter +
          "\\r\\n]*))",
        "gi"
      );
      const gREGEX = /^'+(.*)$/gm;

      // Create an array to hold the data and give the array a default empty first row.
      let arrData = [[]];

      // Create an array to hold our individual pattern matching groups.
      let arrMatches = null;
      let columnIndex = -1;

      // Keep looping over the regular expression matches until we can no longer find a match.
      while ((arrMatches = objPattern.exec(strData))) {
        columnIndex++;

        // Get the delimiter that was found.
        let strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length(is not the start of string) and if it matches field delimiter.
        // If it does not, then it must be a row delimiter.
        if (
          strMatchedDelimiter.length &&
          strMatchedDelimiter !== strDelimiter
        ) {
          // upon reaching a new row of data, add an empty row to the data array.
          arrData.push([]);
          columnIndex = 0;
        }
        let strMatchedValue;

        // Check to see which kind of value is captured (quoted or unquoted).
        if (arrMatches[2]) {
          // It is a  quoted value. Unescape any double quotes.
          strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
        } else {
          // It is a non-quoted value.
          strMatchedValue = arrMatches[3];
        }

        // Skip row at column here?
        let saveCollumn = false;

        //allow only headers to pass
        if (headersIndex.indexOf(columnIndex) > -1) {
          saveCollumn = true;
        }

        //Assume row[0] is headers
        if (headers.indexOf(strMatchedValue) > -1) {
          headersIndex.push(columnIndex);
          saveCollumn = true;
        }
        if (skipHeaders || saveCollumn) {
          arrData[arrData.length - 1].push(
            strMatchedValue.replace(gREGEX, "''$1")
          );
        }
      }

      // Return the parsed data.
      return arrData;
    };

    //Check if there is a sheet to which to paste the data
    if (SdePage == null) {
      throw "Error: No SdePage data";
    }

    //start timer for importing the .csv file
    console.time(
      "imported " + SdePage.csvFile + " to " + SdePage.sheet + " in"
    );

    //call the function to fetch the .csv file
    const csvContent = getCSVData(SdePage);
    const csvData = CSVToArray(csvContent, ",", SdePage.headers);

    let rows = [];
    let cells = [];

    //Set the headers
    rows.push(SdePage.headers);
    //filter invTypes to only include items which are published
    const filteredData = csvData.filter((v, i) => {
      if (i > 0) {
        return v[10] == 1;
      }
    });
    //construct the 2d array
    filteredData.forEach((filteredRow) => {
      filteredRow.forEach((filteredCell) => {
        cells.push(filteredCell);
      });
      rows.push(cells);
      cells = [];
    });
    let i = rows.length;
    let j = rows[0].length;

    let workSheet = prepareSheet(SdePage.sheet);
    let destinationRange = workSheet.getRange(1, 1, i, j);

    //write the 2d array to worksheet
    destinationRange.setValues(rows);

    //delete unused portions of the spreadsheet
    formatSheet(workSheet);

    //end timer
    console.timeEnd(
      "imported " + SdePage.csvFile + " to " + SdePage.sheet + " in"
    );
  }

  ss.flush();
  csvSheets.forEach(buildSDEs);
}

/********************************************************************
 * @class SdePage                                                   *
 ********************************************************************/
class SdePage {
  constructor(sheet, csvFile, headers = null) {
    this.sheet = sheet;
    this.csvFile = csvFile;
    this.headers = [headers].flat();
  }
}

function ensureArray(data) {
  return [data].flat();
}
