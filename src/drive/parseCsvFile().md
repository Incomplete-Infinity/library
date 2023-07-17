# `parseCsvFile()`

## Summary

### Code

```js
function csvFileToObjectArray(csvFileId) {
  return DriveApp.getFileById(csvFileId).getBlob().getDataAsString();
}
```
