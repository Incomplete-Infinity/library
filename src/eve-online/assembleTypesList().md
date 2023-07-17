# `assembleTypesList()`

## Summary

### Code

```js
"use strict";
const { info, log, time, timeEnd, warn, error } = console;
const { parse, stringify } = JSON;
const { fetch } = UrlFetchApp;

const esiVersion = `latest`;
const domain = `https://esi.evetech.net/${esiVersion}/`;
const datasource = `datasource=tranquility`;

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
  const url = `${domain}${path}?${datasource}&page=${page}`;

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
  const url = `${domain}${path}?${datasource}`;

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
```
