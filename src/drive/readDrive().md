# `readDrive()`

## Summary

### Code

```js
/**
 * @name readDrive
 * @description Accesses a file of the users's drive with the given fileID
 * @version 2.0.0
 * @date Dec 9, 2022
 * @auhor PhobiaCide
 * @license MIT
 * @param   {string}  fileID-------------represents the desired file format
 *
 * @return {object}   The text from the file parsed as JSON
 */
function readDrive_(fileID) {
  return JSON.parse(DriveApp.getFileById(fileID).getBlob().getDataAsString());
}
```
