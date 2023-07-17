# `addCustomProperty()`

## Summary

### Code


```js
/**
 * Adds a custom property to a file. Unlike Apps Script's DocumentProperties,
 * Drive's custom file properties can be accessed outside of Apps Script and
 * by other applications (if the visibility is set to PUBLIC).
 * @param {string} fileId The ID of the file to add the property to.
 */
function addCustomProperty(fileId) {
  try {
    const property = {
      key: "department",
      value: "Sales",
      visibility: "PUBLIC",
    };
    // Adds a property to a file
    Drive.Properties.insert(property, fileId);
  } catch (error) {
    // TODO (developer) Handle exception
    console.error(`Failed with error: ${error.message}`);
  }
}
```
