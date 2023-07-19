# `fetchCorporationKills()`

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This function fetches the **kills** of a specific **Eve Online**  *corporation* from the *zKillboard.com* **API** using a given *corporation ID*

## Contents

1. [Preamble](#preamble) - information regarding preparation to run in different environments
   - [Apps Script](#apps-script)
   - [Browser](#browser)
   - [Node.js](#nodejs)
2. [Parameters](#parameters) - rundown of all parameters
3. [Code](#code) - source code for this script for various engines
4. [Return](#return) - information on the script's output
   - [Example Return](#example-return)

---

### Preamble

Depending on the environment, the following code will be needed to enable the script to work.
It should be placed above the function in your document.

#### Apps Script

```js
const { fetch } = UrlFetchApp;
```

#### Browser

```js
// No additional code needed
```

#### Node.js

```js
const fetch = require('node-fetch');
```

---

### Parameters

|Parameter|Description|
|---------|-----------|
|`corporationId`|The *ID* of the *corporation* whose **kills** are to be *fetched* from the *zKillboard* **API**|

---

### Code

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
