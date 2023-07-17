# `fetchCorporationKills()`

## For interacting with the zKillBoard.com API

### Contents

1. [Summary](#summary) - high-level overview of the script's function
2. [Parameters](#parameters) - rundown of all parameters
3. [Apps Script](#apps-script)
   * [Code](#code) - source code for this script for various engines
   * [Browser](#browser)
   * [Node.js](#nodejs)
4. [Return](#return) - information on the script's output

---

### Summary

This function fetches the **kills** of a specific **Eve Online**  *corporation* from the *zKillboard.com* **API** using a given *corporation ID*

---

### Parameters

|Parameter|Description|
|---------|-----------|
|`corporationId`|The *ID* of the *corporation* whose **kills** are to be *fetched* from the *zKillboard* **API**|

---

## Apps Script

### Code

```js
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

```

#### Browser

```js
/**
 * Fetches the kills for a specific corporation from the zKillboard API.
 *
 * @param {number} [corporationId = 98631147] - The ID of the corporation to fetch kills for.
 * @returns {Promise<Object>} - A Promise resolving to the parsed JSON response containing the fetched kill data.
 */
async function fetchCorporationKills(corporationId = 98631147) {
  return await fetch(
    `https://zkillboard.com/api/kills/corporationID/${corporationId}/`
  ).json();
}
```

#### Node.js

```js
const fetch = require('node-fetch');

/**
 * Fetches the kills for a specific corporation from the zKillboard API.
 *
 * @param {number} [corporationId = 98631147] - The ID of the corporation to fetch kills for.
 * @returns {Promise<Object>} - A Promise resolving to the parsed JSON response containing the fetched kill data.
 */
async function fetchCorporationKills(corporationId = 98631147) {
  return await fetch(
    `https://zkillboard.com/api/kills/corporationID/${corporationId}/`
  ).json();
}
```

---

### Return

The **kills** of a *corporation* with the specified `corporationId` from the *zKillboard* **API**.

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
