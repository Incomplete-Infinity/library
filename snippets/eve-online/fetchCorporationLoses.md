# `fetchCorporationLosses()`

## For interacting with the zKillBoard.com API

### Contents

1. [Summary](#summary) - high-level overview of the script's function
2. [Parameters](#parameters) - rundown of all parameters
3. [Apps Script](#apps-script)
   * [Code](#code) - source code for this script for various engines
   * [Browser](#browser)
   * [Node.js](#nodejs)
5. [Return](#return) - information on the script's output

---

### Summary

This function fetches the **losses** of a specific **Eve Online**  *corporation* from the *zKillboard* **API** using a given *corporation ID*

---

### Parameters

|Parameter|Description|
|---------|-----------|
|`corporationId`|The *ID* of the *corporation* whose **losses** are to be *fetched* from the *zKillboard.com* **API**|

---

#### Apps Script

### Code

```js
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
```

#### Browser

```js
/**
 * Fetches the losses for a specific corporation from the zKillboard API.
 *
 * @param {number} [corporationId = 98631147] - The ID of the corporation to fetch losses for.
 * @returns {Promise<Object>} - A Promise resolving to the parsed JSON response containing the fetched loss data.
 */
async function fetchCorporationLosses(corporationId = 98631147) {
  return await fetch(
    `https://zkillboard.com/api/losses/corporationID/${corporationId}/`
  ).json();
}
```

#### Node.js

```js
const fetch = require('node-fetch');

/**
 * Fetches the losses for a specific corporation from the zKillboard API.
 *
 * @param {number} [corporationId = 98631147] - The ID of the corporation to fetch losses for.
 * @returns {Promise<Object>} - A Promise resolving to the parsed JSON response containing the fetched loss data.
 */
async function fetchCorporationLosses(corporationId = 98631147) {
  return await fetch(
    `https://zkillboard.com/api/losses/corporationID/${corporationId}/`
  ).json();
}
```

---

### Return

The **losses** of a *corporation* with the specified `corporationId` from the *zKillboard* **API**.

#### Example

```json
[ 
  { killmail_id: {number},
    zkb: {
      locationID: {number},
      hash: {string},
      fittedValue:  {number},
      droppedValue:  {number},
      destroyedValue:  {number},
      totalValue:  {number},
      points:  {number},
      npc: {boolean},
      solo: {boolean},
      awox: {boolean}
    }
  },
  ...
]
```

---
