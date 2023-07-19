# `fetchCorporationLosses()`

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Description

This function fetches the **losses** of a specific **Eve Online** _corporation_ from the _zKillboard_ **API** using a given _corporation ID_.

## Table of Contents

- [Installation](#installation)
  - [Getting Started](#getting-started)
    - [Apps Script](#apps-script)
    - [Browser](#browser)
    - [Node.js](#nodejs)
- [Usage](#usage)
  - [Function Signature](#function-signature)
  - [Parameters](#parameters)
  - [Return Value](#return-value)
  - [Examples](#examples)
    - [Example Return](#example-return)
- [Implementation](#implementation)
  - [Code](#code)
- [License](#license)

## Installation

### Getting Started

To use this function, ensure you include the appropriate code snippet for your environment before the function.

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
const fetch = require("node-fetch");
```

For Node.js environment, you also need to install the `node-fetch` package. Open your terminal or command prompt and run the following command:

```bash
npm install node-fetch
```

For the Browser and Apps Script environments, no additional installation is required.

## Usage

To use this function, you can call it with a valid _corporation ID_. The function returns a Promise that resolves to the fetched loss data.

### Function Signature

```javascript
async function fetchCorporationLosses(corporationId)
```

### Parameters

| Parameter       | Description                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `corporationId` | (number, optional) The _ID_ of the _corporation_ whose **losses** are to be _fetched_ from the _zKillboard.com_ **API**. |

### Return Value

The function returns a Promise that resolves to the parsed JSON response containing the fetched loss data.

### Examples

```javascript
// Example
const result = await fetchCorporationLosses(98631147);
console.log(result);
```

#### Example Return

```json
[
  { "killmail_id": {number},
    "zkb": {
      "hash": {string},
      "npc": {boolean},
      "solo": {boolean},
      "awox": {boolean},
      "points":  {number},
      "locationID": {number},
      "totalValue":  {number},
      "fittedValue":  {number},
      "droppedValue":  {number},
      "destroyedValue":  {number}
    }
  },
  ...
]
```

## Implementation

### Code

```javascript
/**
 * Fetches the losses for a specific corporation from the zKillboard API.
 *
 * @param {number} corporationId - The ID of the corporation to fetch losses for.
 * @returns {Promise<Object>} - A Promise resolving to the parsed JSON response containing the fetched loss data.
 */
async function fetchCorporationLosses(corporationId) {
  return await fetch(
    `https://zkillboard.com/api/losses/corporationID/${corporationId}/`
  );
}
```

## License

This project is licensed under the MIT License. For more information, see the [LICENSE](./../../LICENSE.md) file.

---
