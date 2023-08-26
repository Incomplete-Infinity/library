# `fetchCorporationLosses()`

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This function fetches the **losses** of a specific **Eve Online**  *corporation* from the *zKillboard* **API** using a given *corporation ID*

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
// No additional code needed.
```

#### Node.js

```js
const fetch = require('node-fetch');
```

### Parameters

|Parameter|Description|
|---------|-----------|
|`corporationId`|The *ID* of the *corporation* whose **losses** are to be *fetched* from the *zKillboard.com* **API**|

---

### Code

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

---

### Return

The **losses** of a *corporation* with the specified `corporationId` from the *zKillboard* **API**.

#### Example Return

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


# `fetchCorporationLosses()`

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This function fetches the **losses** of a specific **Eve Online** *corporation* from the *zKillboard* **API** using a given *corporation ID*.

## Contents

1. [Preamble](#preamble) - information regarding preparation to run in different environments
   - [Apps Script](#apps-script)
   - [Browser](#browser)
   - [Node.js](#nodejs)
2. [Parameters](#parameters) - rundown of all parameters
3. [Code](#code) - source code for this script for various engines
4. [Return](#return) - information on the script's output
   - [Example Return](#example-return)
5. [Installation](#installation) - how to set up the function for Node.js users
6. [Usage](#usage) - examples of how to use the function in different environments
7. [License](#license) - MIT license information

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
// No additional code needed.
```

#### Node.js

```js
const fetch = require('node-fetch');
```

### Parameters

|Parameter|Description|
|---------|-----------|
|`corporationId`|The *ID* of the *corporation* whose **losses** are to be *fetched* from the *zKillboard.com* **API**|

---

### Code

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

---

### Return

The **losses** of a *corporation* with the specified `corporationId` from the *zKillboard* **API**.

#### Example Return

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

### Installation

To use this function in Node.js, make sure you have `node-fetch` installed. If not, you can install it using npm:

```
npm install node-fetch
```

### Usage

#### Apps Script

```js
// Ensure you have the preamble code above this function.

async function main() {
  const corporationId = 123456789; // Replace with the desired corporation ID.
  const result = await fetchCorporationLosses(corporationId);
  console.log(result); // Process the fetched loss data here.
}
```

#### Browser

```html
<!-- Include the preamble code above this script. -->

<script>
  async function fetchData() {
    const corporationId = 123456789; // Replace with the desired corporation ID.
    const result = await fetchCorporationLosses(corporationId);
    console.log(result); // Process the fetched loss data here.
  }

  fetchData();
</script>
```

#### Node.js

```js
// Ensure you have the preamble code above this function.
const fetch = require('node-fetch');

async function fetchData() {
  const corporationId = 123456789; // Replace with the desired corporation ID.
  const result = await fetchCorporationLosses(corporationId);
  console.log(result); // Process the fetched loss data here.
}

fetchData();
```

---

### License

This project is licensed under the MIT License. For more information, see the [LICENSE](LICENSE) file.

---
