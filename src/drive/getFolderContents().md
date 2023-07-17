# `getFolderContents()`

## Summary

### Code

```js
/**
 * @name getFolderContents
 * @description Return an array of up to 20 filenames contained in the folder previously specified (or the root folder by default).
 *
 * @param {String} folderId String ID of folder whose contents
 *     are to be retrieved; if this is 'root', the
 *     root folder is used.
 * @return {Object} list of content filenames, along with
 *     the root folder name.
 */
function getFolderContents(folderId = `root`) {
  const contents = {
    children: []
  };
  const topFolder = folderId == `root`
    ? DriveApp.getRootFolder()
    // May throw exception if the folderId is invalid or app doesn't have permission to access.
    : DriveApp.getFolderById(folderId) ;
  contents.rootName = `${topFolder.getName()}/`;
  const files = topFolder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    contents.children.push(file.getName());
  }
  return contents;
}
```
