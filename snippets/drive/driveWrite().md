# `driveWrite()`

## Summary

### Code

```js
/**
 * @summary Saves an object to the user's drive and logs the file details.
 * @description Saves the given `object` in the user's drive with the given `title` and `mimeType`.
 * It then logs the `file name`, `ID`, `size` (in bytes), and `type` of the newly created file.
 * @version 2.0.0
 * @date Dec 9, 2022
 * @author PhobiaCide
 * @copyright Andrew Amason 2022
 * @license MIT
 * @param {object} [options={ object: { key: 'value' }, title: 'untitled', mimeType: 'application/json' }] - The parameters for this function
 * @param {object} [options.object={ key: 'value' }] - The object to be saved in the user's drive.
 * @param {string} [options.title='untitled'] - The desired title for the file.
 * @param {string} [options.mimeType='application/json'] - The desired mime type of the file.
 * @see https://developers.google.com/apps-script/reference/base/mime-type
 * @return {void} - No return
 */
function driveWrite(
  // TODO (Developer) Add error handling
  object = { key: `value` },
  title = `untitled`,
  mimeType = `application/json`
) {
  try {
    const fileSets = {
      title,
      mimeType,
    };
    const blob = Utilities.newBlob(
      JSON.stringify(object),
      `application/vnd.google-apps.script+json`
    );
    const file = Drive.Files.insert(fileSets, blob);

    console.info(`
File name______________________${title},
File ID________________________${file.id},
File size(bytes)_______________${file.fileSize},
File type______________________${file.mimeType}`);
  } catch (error) {
    throw new Error(`Error saving file: ${error.message}`);
  }
}
```
