"use strict";
const { info, log, time, timeEnd, warn, error } = console;
const { parse, stringify } = JSON;
const { fetch } = UrlFetchApp;

const esiVersion = `latest`;
const domain = `https://esi.evetech.net/${esiVersion}/`;
const dataSource = `datasource=tranquility`;

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
const userAgent = `
  Mozilla/5.0 (
    compatible; 
    Google-Apps-Script;
    beanserver;
    +https://script.google.com;
    ${ScriptApp.getScriptId()};
  )`;
const muteHttpExceptions = true;

const tools = {
  ensureArray: data => [data].flat(),
  ensure2DArray: array2d =>
    tools.ensureArray(array2d).map(array1d => tools.ensureArray(array1d)),
};

const http = {
  // Function to handle GET request
  getRequest: async url => {
    time(`Handled http GET request @ ${url} in `);
    info(`Handling http GET request @ ${url}.`)
    const options = {
      method: "GET",
      headers,
      muteHttpExceptions,
      "User-Agent": userAgent
    };
    timeEnd(`Handled http GET request @ ${url} in `);

    return await fetch(url, options);
  },
  // Function to handle POST request
  postRequest: async (url, payload) => {
        time(`Handled http POST request @ ${url} in `);
    info(`Handling http POSt request @ ${url}.`)
    const options = {
      method: "POST",
      headers,
      payload,
      muteHttpExceptions,
      "User-Agent": userAgent
    };
  timeEnd(`Handled http POST request @ ${url} in `);

    return await fetch(url, options);
  },
};

/**
 * Retrieves the type IDs from the ESI API.
 * @param {number} [page=1] - The page number to retrieve the type IDs from.
 * @returns {Promise<Array>} - The array of type IDs.
 * @throws {Error} - If there is an error retrieving the type IDs.
 */
async function getTypeIds(page = 1) {
  const path = `universe/types/`;
  const url = `${domain}${path}?${dataSource}&page=${page}`;

  try {
    const response = await http.getRequest(url);
    const xPages = response.getHeaders()["x-pages"];
    const content = response.getContentText();
    const data = parse(content);

    // If there are more pages to retrieve, recursively concatenate the data
    // from subsequent pages, otherwise return the final array of type IDs.
    return page < xPages ? data.concat(await getTypeIds(page + 1)) : data;
  } catch (e) {
    console.error("Error retrieving type IDs:", e.message);
    throw error;
  }
}

/**
 * Resolves the given type IDs to their corresponding names.
 * @param {Array} typeIds - The array of type IDs to resolve.
 * @returns {Promise<Array>} - The array of resolved type names.
 * @throws {Error} - If there is an error resolving the type IDs to names.
 */
async function resolveIdsToNames(typeIds) {
  const path = `universe/names/`;
  const url = `${domain}${path}?${dataSource}`;

  try {
    const names = [];
    while (typeIds.length > 0) {
      // Split the type IDs into groups of 1000 or less for efficient processing
      const group = typeIds.splice(0, 1000);
      const payload = stringify(group);
      const response = await http.postRequest(url, payload);
      const content = response.getContentText();
      const data = parse(content);
      // Concatenate the resolved names to the `names` array
      names.push(...data);
    }

    // Return the array of resolved type names
    return names.map(({ id, name }) => ({ id, name }));
  } catch (e) {
    error("Error resolving type IDs to names:", e.message);
    throw error;
  }
}

/**
 * Assembles the list of types with their names.
 * @returns {Promise<Array>} - The array of types with their names.
 * @throws {Error} - If there is an error assembling the types list.
 */
async function assembleTypesList() {
  try {
    // Retrieve the type IDs from the ESI API
    const typeIds = await getTypeIds();
    // Resolve the type IDs to their corresponding names
    const typesList = await resolveIdsToNames(typeIds);

    // Return the array of types with their names
    return typesList;
  } catch (e) {
    error("Error assembling types list:", e.message);
    throw error;
  }
}

/**
 * Assembles the list of types with their names into a 2-dimensional array for use in a Google Sheet.
 * @returns {Promise<Array>} - The 2D array of types with their names.
 * @throws {Error} - If there is an error assembling the types list for the sheet.
 */
async function assembleTypesListForSheet() {
  try {
    // Assemble the list of types with their names
    const types = await assembleTypesList();
    // Convert the types array to a 2D array with ID and name columns
    const typesArray = tools.ensure2DArray(
      types.map(({ id, name }) => [Number(id), name])
    );
    // Sort the type IDs in ascending order
    const sorted = typesArray.sort((typeA, typeB) => typeA[0] - typeB[0]);

    // Return the sorted 2D array of types with their names
    return await sorted;
  } catch (error) {
      error("Error assembling types list for sheet:", e.message);
    throw error;
  }
}

/**
 * This function builds and sends multiple requests to retrieve market history data for specific item
 * types in a specific region using the GESI library in JavaScript.
 */
function buildRequest(typeIds, regionId = 10000002) {
  typeIds = extractIds(typeIds);

  const client = GESI.getClient().setFunction(`markets_region_history`);
  const requests = typeIds.map((typeId) => client.buildRequest({
      type_id: typeId,
      region_id: regionId
    })
  );
  log(requests);
  const responses = UrlFetchApp.fetchAll(requests);
  log(responses);

  return responses;
}

/**
 * The function `contractAppraisal` takes in several parameters and constructs a URL for an API request
 * to the Contracts Appraisal service.
 * @param [typeId=1296] - The ID of the item type being appraised.
 * @param [includePrivate=false] - a boolean value indicating whether to include private contracts in
 * the appraisal or not. Default is false.
 * @param [includeBpc=false] - A boolean value indicating whether or not to include Blueprint Copies
 * (BPCs) in the appraisal.
 * @param [security] - The security level of the location where the appraisal is being done. It has a
 * default value of "highsec" which stands for high security space in the game EVE Online. Other
 * possible values are "lowsec" and "nullsec".
 * @param [materialEfficiency=0] - A number representing the material efficiency level of the item
 * being appraised. Defaults to 0 if not provided.
 * @param [timeEfficiency=0] - A number representing the time efficiency level of the item being
 * appraised. It has a default value of 0.
 */
function contractAppraisal(
  typeId = 1296,
  includePrivate = false,
  includeBpc = false,
  security = `highsec`,
  materialEfficiency = 0,
  timeEfficiency = 0
) {
  const domain = `https://api.contractsappraisal.com`;
  const endPoint = `/v1/prices/`;
  console.log(arguments);
  const parameters = [
    `include_private=${includePrivate}`,
    `bpc=${includeBpc}`,
    `security=${security}`,
    `material_efficiency=${materialEfficiency}`,
    `time_efficiency=${timeEfficiency}`
  ];
  const query = `?1`;

  const url = `${domain}${endPoint}${query}`;
  console.log(url);
}

function extractIds(dirtyTypeIds) {
  return [
    ...new Set(
      dirtyTypeIds
        .flat(Infinity)
        .filter(Number)
        .sort((a, b) => a - b)
    )
  ];
}

/**
 * This function fetches all kills for a given alliance ID from the zKillboard API.
 * @param [allianceID=99011193] - The ID of the alliance for which you want to fetch the kills data
 * from the zKillboard API. The default value is set to 99011193, which is the alliance ID for Pandemic
 * Horde in EVE Online.
 * @returns The function `fetchAllianceKills_` is returning the result of a URL fetch request to the
 * zKillboard API for all kills made by the specified alliance ID. The result could be a JSON object
 * containing information about the kills made by the alliance.
 */
function fetchAllianceKills(allianceID = 99011193) {
  return cacheUrlFetchApp(`https://zkillboard.com/api/kills/allianceID/${allianceID}/`);
}

/**
 * This function fetches all losses for a given alliance ID from the zKillboard API.
 * @param [allianceID=99011193] - The allianceID parameter is the unique identifier for an alliance in
 * the game EVE Online. It is used in the zKillboard API to retrieve information about losses (ships
 * destroyed) for a specific alliance.
 * @returns the result of a URL fetch request to the zKillboard API for all losses of a specified
 * alliance ID.
 */
function fetchAllianceLosses(allianceID = 99011193) {
  return cacheUrlFetchApp(`https://zkillboard.com/api/losses/allianceID/${allianceID}/`);
}

/**
 * Fetches corporation kills from the zKillboard API.
 *
 * @param {number} [corporationId = 98631147] - The ID of the corporation to fetch kills for. Defaults to 98631147.
 * @returns {Promise<Response>} - A Promise that resolves to the response from the API.
 */
function fetchCorporationKills(corporationId = 98631147) {
  return JSON.parse(
    UrlFetchApp.fetch(
      `https://zkillboard.com/api/kills/corporationID/${corporationId}/`
    ).getContentText()
  );
}

/**
 * Fetches the losses for a specific corporation from the zKillboard API.
 *
 * @param {number} [corporationId = 98631147] - The ID of the corporation to fetch losses for.
 * @returns {GoogleAppsScript.URL_Fetch.HTTPResponse} - The HTTP response object containing the fetched loss data.
 */
async function fetchCorporationLosses(corporationId = 98631147) {
  return await JSON.parse(
    UrlFetchApp.fetch(
      `https://zkillboard.com/api/losses/corporationID/${corporationId}/`
    ).getContentText()
  );
}

/**
 * This function retrieves market data for a list of item IDs from the EveMarketer API.
 * @param typeIDs - An array of EVE Online item type IDs for which market data is requested.
 * @param [regionID=10000002] - The ID of the region to retrieve market data for. The default value is
 * 10000002, which corresponds to the region of The Forge in EVE Online.
 * @param [systemId=false] - The ID of the solar system to retrieve market data for. If not specified,
 * market data for the entire region will be retrieved instead.
 * @returns An array of fetch requests.
 */
function getEveMarketerData_(typeIDs, regionID = 10000002, systemId = false) {
	// Jita: 30000142
	const result = [];

	const domain = `https://api.evemarketer.com`;
	const subDirectory = `/ec/marketstat/json`;

	const chunkSize = 100;
	try {
		if (typeIDs.length == 0) {
			throw new Error(
				`Required parameter, "typeIDs" is not defined!`
			);

		} else {
			do {
				const length = typeIDs.length;
				const chunk = length > chunkSize ? chunkSize : length;
				const encodedTypes = typeIDs.splice(0, chunk).join(`&typeid=`);
				const query = systemId ? `${encodedTypes}?typeid=&usesystem=${systemID}` : `${encodedTypes}?typeid=&regionlimit=${regionID}` ;

				const url = `${domain}${subDirectory}${query}`;
				result.push(
					fetch(url)
				);
			} while (typeIDs.length > 0);
		}

	} catch (error) {
		console.error(error.message);

	} finally {
		return result;
	}
}

/**
 * The function retrieves industry prices for items in the game EVE Online and returns them in a sorted
 * array, with the option to include headers.
 * @param [showHeaders=true] - A boolean parameter that determines whether or not to include headers in
 * the returned data. If set to true, the function will return an array with headers as the first
 * element and the prices as subsequent elements. If set to false, the function will only return the
 * prices array.
 * @returns The function `getIndustryPrices` returns an array of arrays containing the `Type ID`,
 * `Average Price`, and `Adjusted Price` for each item in the EVE Online game, sorted by `Type ID`. The
 * first array in the returned array contains the headers for each column (`Type ID`, `Average Price`,
 * `Adjusted Price`) if `showHeaders` is set to `true`.
 */
function getIndustryPrices(showHeaders = true) {
  const headers = [`Type ID`, `Average Price`, `Adjusted Price`];
  const url = `https://esi.evetech.net/latest/markets/prices/?${dataSource}`;
  const options = { method: `GET` };
  const response = UrlFetchApp.fetch(url, options);
  const code = response.getResponseCode();

  if (code !== 200) {
    throw new Error(`Failed to fetch prices
    Response Code: ${code}`);
  }

  const content = response.getContentText();
  const json = JSON.parse(content);
  const prices = json
    .map((item) => [item.type_id, item.average_price, item.adjusted_price])
    .sort((a, b) => a[0] - b[0]);

  return showHeaders ? [headers, ...prices] : prices;
}

"use strict";

const emailAddress = "" ?? false;
const emailUa = (emailAddress) 
  ? `email: ${emailAddress}`
  : null;

/**
 * @summary Loads region aggregates for the given price IDs.
 * @param {number[]|string[]} priceIds - List of type IDs.
 * @param {number} [regionId=10000002] - Region ID. Defaults to 10000002 (The Forge).
 * @param {boolean} [includeHeaders=true] - Whether to include headers in the result. Defaults to true.
 * @returns {Array<Array<number|string>>} - Array of aggregated prices.
 * @throws {string} - Throws an error if priceIds parameter is not defined.
 */
function loadRegionAggregates(
  priceIds,
  regionId = 10000002,
  includeHeaders = true
) {
  // Check if priceIds parameter is defined
  if (typeof priceIds === "undefined") {
    throw 'Required variable, "priceIds" is not defined! Need a list of type IDs!';
  }

  const config = {
    batchSize: 100,
    fetchOptions: {
      method: "get",
      payload: "",
      "User-Agent": `
  Mozilla/5.0 (
    compatible; 
    Google-Apps-Script;
    beanserver;
    +https://script.google.com;
    id: ${ScriptApp.getScriptId()};
    email: ${email}
  )`,
    },
    // comment out (//) any headers you don't want in the output   
    headers: [
      "Buy Volume",
      "Buy Weighted Average",
      "Buy Max",
      //'Buy Min',
      "Buy Std Dev",
      "Buy Median",
      "Buy Percentile",
      "Sell Volume",
      "Sell Weighted Average",
      //'Sell Max',
      "Sell Min",
      "Sell Std Dev",
      "Sell Median",
      "Sell Percentile",
    ],
    propertyMappings: {
      volume: /Volume/i,
      weightedAverage: /Weighted Average/i,
      max: /Max/i,
      min: /Min/i,
      stddev: /Std Dev/i,
      median: /Median/i,
      percentile: /Percentile/i,
    },
  };

  // Map the headers to properties based on the defined property mappings
  const properties = config.headers.map(item => {
    const mapping = Object.entries(config.propertyMappings).find(([_, regex]) =>
      regex.test(item)
    );

    const [propertyKey] = mapping && mapping;
    const categoryKey = item && item.split(" ")[0]; // Extract the category key from the header

    return mapping ? `${categoryKey.toLowerCase()}.${propertyKey}` : null;
  });

  /**
   * Fetches aggregates data from the API for the specified batches and region ID.
   *
   * @param {Array<Array<number|string>>} batches - Array of batches containing type IDs.
   * @param {number} regionId - Region ID.
   * @returns {Array<object>} - Array of fetched responses.
   */
  const fetchAggregatesData = (batches, regionId) => {
    const domain = "https://market.fuzzwork.co.uk/";
    const url = `${domain}aggregates/?region=${regionId}&types=`;
    const { fetchOptions } = config;
    return UrlFetchApp.fetchAll(
      batches.map(batch => ({ url: url + batch.join(","), fetchOptions }))
    );
  };

  /**
   * Returns an array of clean type IDs by removing duplicates and filtering out non-numeric values.
   *
   * @param {number[]|string[]} priceIds - List of type IDs.
   * @returns {number[]} - Array of clean type IDs.
   */
  const getCleanTypeIds = priceIds => {
    return Array.from(new Set([priceIds].flat(Infinity).filter(Number)));
  };

  /**
   * Splits the array of type IDs into batches based on the defined batch size.
   *
   * @param {number[]} typeIds - Array of type IDs.
   * @returns {Array<Array<number>>} - Array of batches.
   */
  const splitIntoBatches = typeIds => {
    const { batchSize } = config;
    return Array.from(
      { length: Math.ceil(typeIds.length / batchSize) },
      (_, index) => {
        const start = index * batchSize;
        const end = start + batchSize;
        return typeIds.slice(start, end);
      }
    );
  };

  /**
   * Processes the fetched responses and extracts the required data.
   *
   * @param {Array<object>} responses - Array of fetched responses.
   * @param {number[]} typeIds - Array of type IDs.
   * @returns {Array<object>} - Array of extracted data.
   */
  const processResponses = (responses, typeIds) => {
    const extractedData = [];

    responses.forEach((response, index) => {
      const { batchSize } = config;
      const json = JSON.parse(response.getContentText());
      if (json) {
        const chunk = typeIds.slice(index * batchSize, (index + 1) * batchSize);
        chunk.forEach(entry => {
          const data = json[entry];
          const extractedEntry = properties.reduce((obj, prop) => {
            if (prop) {
              const [objectKey, propertyKey] = prop.split(".");
              if (
                data &&
                data[objectKey] &&
                data[objectKey][propertyKey] !== undefined
              ) {
                const value = +data[objectKey][propertyKey];
                obj[prop] = value;
              }
            }
            return obj;
          }, {});

          extractedData.push(extractedEntry);
        });
      }
    });

    return extractedData;
  };

  const cleanTypeIds = getCleanTypeIds(priceIds);
  const batches = splitIntoBatches(cleanTypeIds);
  const responses = fetchAggregatesData(batches, regionId);
  const aggregatedPrices = processResponses(responses, cleanTypeIds);

  return includeHeaders
    ? [
        config.headers,
        ...aggregatedPrices.map(row => properties.map(prop => row[prop])),
      ]
    : aggregatedPrices.map(row => properties.map(prop => row[prop]));
}

function zKillWebSocket() {
  const socketUrl = `wss://zkillboard.com/websocket/`
  const webSocket = new WebSocket(socketUrl, protocol);
    webSocket.send({"action": "sub", "channel": "killstream"});
  console.log(webSocket);
}