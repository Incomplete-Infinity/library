function test() {
  console.log(loadRegionAggregates([[19],[20],[21],[22]]));
}
const ss = SpreadsheetApp.getActiveSpreadsheet();
const baseUrl = 'https://www.fuzzwork.co.uk/dump/latest/';

/**
 * @const
 * @alias loadRegionAggregates
 * @summary Returns aggregated market data for given type IDs from https://market.fuzzwork.co.uk
 * @description
 *  The function takes 3 arguments:
 *    typeIds     (an array of type IDs)
 *    regionId    (a string representing the region ID)
 *    showHeaders (a flag indicating whether to include headers in the output)
 *  The function returns an array of market data, with each row representing a type ID
 *  If the "typeIds" argument is not defined, an error will be thrown
 *  The main function uses fetch to retrieve data from the website and parse it as JSON
 *  The retrieved data is then processed and formatted into a 2D array
 *  with the headers included as the first entry based on the value of the "showHeaders" argument
 *  The Math.random() * 5000 calculation is used to introduce a random sleep time between server
 *  requests in order to distribute the load on the server.
 * @param   {number[]}        typeIds     - An array of type IDs to retrieve market data for.
 * @param   {(string|Number)} regionId    - The region ID to retrieve market data for.
 * @param   {boolean}         showHeaders - A flag indicating whether to include headers in the output.
 * @returns {Array}           An array of market data, with each row representing a type ID.
 * @throws  {Error}           If there is an error fetching the data from the server.
 */
const loadRegionAggregates = async (
  dirtyTypeIds = false,
  regionId = 10000002,
  showHeaders = true
) => {
  const prices = [];
  try {
    await checkDirtyTypeIds(dirtyTypeIds);
    let cleanTypeIds = await cleanTypeIdsArray(dirtyTypeIds);
    if (!cleanTypeIds.length)
      throw new Error(`There are no numbers in the array!`);
    let typeList = await cleanTypeIds.length;
    while (typeList > 0) {
      let types = await getTypes(cleanTypeIds, typeList);
      let query = await createQuery(regionId, types);
      let response = await fetch(`${baseUrl}${query}`);
      let json = await JSON.parse(response);
      await prices.push(...formatData(types, json));
      typeList = await cleanTypeIds.length;
      await sleep(Math.random() * 5000);
    }
  } catch (error) {
    console.error(`${error.message}`);
    throw error; // Rethrow the error to propagate it to the caller
  } finally {
    return (showHeaders) ? formatHeaders(prices) : prices;
  }
};

// Check that dirtyTypeIds is defined
const checkDirtyTypeIds = async (dirtyTypeIds) => {
  if (!dirtyTypeIds)
    throw new Error(`Required variable "dirtyTypeIds" is not defined!`);
};

// Clean Type Ids Array
const cleanTypeIdsArray = async (dirtyTypeIds) => {
  return [
    ...new Set(
      dirtyTypeIds
        .flat(Infinity)
        .filter(Number)
        .sort((a, b) => a - b)
    )
  ];
};

// Get Types
const getTypes = async (cleanTypeIds, typeList) => {
  return cleanTypeIds.splice(0, Math.min(5000, typeList));
};

// Create Query
const createQuery = async (regionId, types) => {
  return `?region=${regionId}&types=${types.join(',')}`;
};

// Sleep function to introduce a delay
const sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Format Data
const formatData = (types, json) => {
  return types.map(type => {
    const { buy, sell } = json[type];
    return [
      +type,
      +buy.weightedAverage,
      +buy.max,
      +buy.median,
      +buy.volume,
      +buy.orderCount,
      +buy.percentile,
      +sell.weightedAverage,
      +sell.min,
      +sell.median,
      +sell.volume,
      +sell.orderCount,
      +sell.percentile
    ];
  });
};

// Format Headers
const formatHeaders = (prices) => {
  const headers = [
    'Type ID',
    'Buy Weighted Mean',
    'Highest Bid',
    'Buy Median',
    'Buy Volume',
    'Buy Order Count',
    'Buy 5% Mean',
    'Sell Weighted Mean',
    'Lowest Offer',
    'Sell Median',
    'Sell Volume',
    'Sell Order Count',
    'Sell 5% Mean'
  ];
  return [headers, ...prices];
};

async function importSDE() {
  const sheets = await [
    'industryActivity',
    'industryBlueprints',
    'industryActivityProducts',
    'industryActivityMaterials'
  ];
  const invTypes = await parseInvTypes();
  const typeIds = await invTypes.map(row => row[0]);
  const promises = await sheets.map(sheetName => buildSDEs(sheetName, typeIds));
  await Promise.all(promises);
}
async function parseInvTypes() {
  const csvContent = await fetchCsv(`invTypes`);
  const parsedCsv = await Utilities.parseCsv(csvContent);
  const filteredCsv = await parsedCsv.filter(row => row[10] !== '0' && row[11] !== 'None');
  const { lastRow, lastCol } = await measureData(filteredCsv);
  const sheet = await prepareSheet('invTypes');
  sheet.getRange(1, 1, lastRow, lastCol).setValues(filteredCsv);
  cropSheet(sheet);
  return filteredCsv;
}
async function buildSDEs(SdePage, typeIds) {
  return new Promise(async (resolve, reject) => {
    try {
      const sheet = await callSheet(SdePage);
      const csvContent = await fetchCsv(SdePage);
      const parsedCsv = await Utilities.parseCsv(csvContent);
      const filteredCsv = await parsedCsv.filter(row => typeIds.includes(row[0]));
      const { lastRow, lastCol } = await measureData(filteredCsv);
      const preparedSheet = await prepareSheet(SdePage);
      const range = await preparedSheet.getRange(1, 1, lastRow, lastCol);
      range.setValues(filteredCsv);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
async function fetchCsv(name) {
  return await fetch(`${baseUrl}${name}.csv`).getContentText();
}
async function fetch(url) {
  return await UrlFetchApp.fetch(url);
}
async function parseCsv(csv) {
  return await Utilities.parseCsv(csv);
}
async function measureData(data) {
  if (!Array.isArray(data[0])) {
    throw new Error(`variable "data" must be a 2D array!`);
  } else {
    const lastRow = await data.length;
    const lastCol = await data[0].length;
    return await { lastRow, lastCol };
  }
}
async function newSheet(name) {
  return await ss.insertSheet().setName(name);
}
async function prepareSheet(sheetName) {
  if (!sheetName) {
    throw new Error("Sheet name is required.");
  }
  const sheet = await ss.getSheetByName(sheetName);
  return await (sheet != null)
    ? sheet.clearContents()
    : newSheet(sheetName);
}
async function measureSheet(sheet) {
  return await { maxRows: await sheet.getMaxRows(), maxCols: await sheet.getMaxColumns() };
}
async function callSheet(sheetName) {
  const sheet = await ss.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found.`);
  }
  return await sheet;
}
async function cropSheet(sheet) {
  const { maxRows, maxCols } = await measureSheet(sheet);
  const { getLastColumn, getLastRow } = await sheet;
  const lastCol = Math.max(2, getLastColumn());
  if (lastCol !== maxCols) sheet.deleteColumns(lastCol, maxCols - lastCol);
  const lastRow = Math.max(2, getLastRow());
  if (lastRow !== maxRows) sheet.deleteRows(lastRow, maxRows - lastRow);
  return await sheet;
}
async function priceData() {
  const ss = await SpreadsheetApp.getActiveSpreadsheet();
  const { getRange, getFrozenRows, getLastRow } = await ss.getSheetByName('Prices');
  const typeIds = await getRange(getFrozenRows() + 1, 1, getLastRow(), 1).getValues();
  const priceData = await loadRegionAggregates(typeIds);
  getRange(1, 2, priceData.length, priceData[0].length).setValues(priceData);
}