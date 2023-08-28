# `postRequest()`

## Summary

The `postRequest()` function enables you to perform a POST request using JavaScript. It can be used in various environments such as the browser, Node.js, or Google Apps Script. Below are the code examples for each environment:

## Code

### Browser

```js
async function postRequest(url) {
  const method = 'POST';
  const headers = {
    'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36'
  };
  const payload = { key: 'value' };

  const options = {
    method,
    headers,
    body: JSON.stringify(payload)
  };

  const response = await fetch(url, options);
  return response.json();
}
```

### Node

```js
const fetch = require('node-fetch');

async function postRequest(url) {
  const method = 'POST';
  const headers = {
    'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36'
  };
  const payload = { key: 'value' };

  const options = {
    method,
    headers,
    body: JSON.stringify(payload)
  };

  const response = await fetch(url, options);
  return response.json();
}
```

### Google Apps Script

```js
const postRequest = url => {
  const { fetch } = UrlFetchApp;
  const method = 'POST';
  const headers = {
    'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36'
  };
  const payload = { key: 'value' };

  const options = {
    method,
    headers,
    payload
  };

  const response = await fetch(url, options);
  return JSON.parse(response.getContentText());
}
```

### Description

Each version of the `postRequest()` function is now marked as async, allowing proper handling of asynchronous operations when making network requests.

### Usage

To use the `postRequest()` function, simply call it with the desired URL as the argument:

```js
const url = 'https://api.example.com/data';
const response = await postRequest(url);
console.log(response);
```

The function will make a POST request to the specified URL and return the parsed JSON response.

Remember to handle any potential errors that might occur during the request process.
