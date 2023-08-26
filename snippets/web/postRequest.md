# `postRequest()`

## Summary

### Code

```js
function postRequest(url) {
// Make a POST request 
  const method = `POST`;
  const headers = {
    user-agent: `Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36`
  };
  const payload = {key: value}
  
  const options = {
    method,
    headers,
    payload
  };

  return JSON.parse(UrlFetchApp.fetch(url, options).getContentText());
}
```
