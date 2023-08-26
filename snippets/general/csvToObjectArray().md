# `csvDataToObjectArray()`

## Summary

### Code

```js
function csvFileToObjectArray(csvFileId) {
  const csvData = DriveApp.getFileById(csvFileId).getBlob().getDataAsString();

  return csvDataToObjectArray(csvData);
}

function csvDataToObjectArray(csvData) {
  const [headerRow, ...dataRows] = csvData
    .split("\n")
    .map((row) => row.split(","));

  return dataRows.map((dataRow) =>
    headerRow.reduce(
      (obj, key, index) => ({ ...obj, [key]: dataRow[index] }),
      {}
    )
  );
}
```
