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

/**
 * @constant
 * @name cacheUrlFetchApp
 * @alias cacheUrlFetchApp
 * @summary Handles caching for http requests
 * @description  Checks if the return from a Url fetch is in cache. If so, it retrieves it from cache instead of making another network request. If not, it makes a new request and adds it to the cache
 * @param   {String}  fetchUrl    - The URL to be fetched and cached.
 * @param   {Object} [parameters]  - An optional object parameter that contains the method and payload to be used
 * @return the result of the Url fetch, either from the cache or by making a network request.
 */
const cacheUrlFetchApp = (
  fetchUrl,
  parameters = { method: `get`, payload: `` }
) => {
  const { fetch } = UrlFetchApp;
  // Set up public cache
  const cache = CacheService.getScriptCache();
  // Turn the requested Url into a string based on the MD5
  const digest = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, fetchUrl));
  // Based on this MD5, lookup the Url in the cache
  const cached = cache.get(digest);
  // If a result has been already cached, use it
  if (cached != null) {
    return cached;
  }
  // Make the network requests at random intervals to avoId server overload
  Utilities.sleep(Math.random() * 1000 * 5);
  // Fetch the Url
  const resultXML = fetch(fetchUrl, parameters);
  // Get the text of the Url call
  const result = resultXML.getContentText();
  // Cache the result in chunks
  const chunkSize = 100000; // 100KB
  for (let i = 0; i < result.length; i += chunkSize) {
    cache.put(`${digest}_${i}`, result.substring(i, i + chunkSize), 21600);
  }

  // return the result
  return result;
};

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

/**
 * GitHub  https://github.com/tanaikech/FilesApp<br>
 * getFilesAndFoldersInFolder method for FilesApp.<br>
 * - Retrieve files and folders just under a folder with folderId.
 * @param {String} folderId folderId.
 * @param {Object} mimeType One dimensional Array including mimeType you want to retrieve.
 * @param {String} fields fields which can be used at drive.files.list.
 * @param {String} accessToken Access token.
 * @return {Object} Return Object
 */
function getFilesAndFoldersInFolder(folderId, mimeType, fields, accessToken) {
  var fa = new FilesApp(accessToken);
  return fa.getFilesAndFoldersInFolder(folderId, mimeType, fields);
}

/**
 * getAllFoldersInFolder method for FilesApp.<br>
 * - Retrieve all folders of all level under folderId.
 * @param {string} folderId folderId
 * @param {String} accessToken Access token.
 * @return {Object} Return Object
 */
function getAllFoldersInFolder(folderId, accessToken) {
  var fa = new FilesApp(accessToken);
  return fa.getAllFoldersInFolder(folderId);
}

/**
 * getAllInFolder method for FilesApp.<br>
 * - Retrieve all files and folders of all level under folderId. All files and folders are included in an array without the level.
 * @param {string} folderId folderId
 * @param {Object} mimeType One dimensional Array including mimeType you want to retrieve.
 * @param {String} fields fields which can be used at drive.files.list.
 * @param {String} accessToken Access token.
 * @return {Object} Return Object
 */
function getAllInFolder(folderId, mimeType, fields, accessToken) {
  var fa = new FilesApp(accessToken);
  return fa.getAllInFolder(folderId, mimeType, fields);
}

/**
 * createTree method for FilesApp.<br>
 * - Create a file and folder tree. Retrieve all folders of all level under folderId. All files and folders are included in an array with the level.
 * @param {string} folderId Retrieve all folders of all level under folderId.
 * @param {Object} mimeType One dimensional Array including mimeType you want to retrieve.
 * @param {String} fields fields which can be used at drive.files.list.
 * @param {String} accessToken Access token.
 * @return {Object} Return Object
 */
function createTree(folderId, mimeType, fields, accessToken) {
  var fa = new FilesApp(accessToken);
  return fa.createTree(folderId, mimeType, fields);
}

// DriveApp.createFile(); // This is used for automatically enabling Drive API and detecting the scope for using Drive API by the script editor.

((r) => {
  var FilesApp;
  FilesApp = (function () {
    var checkFields,
      createBatchRequests,
      createQ,
      createRequests,
      getAllFoldersInFolderMain,
      getDriveId,
      getFilesByAPIByFetchAll,
      getFilesByAPIByFetchAllforNoBatch,
      getFilesByAPIInit,
      getFilesInFolder,
      getQueryFromMimeTypes,
      getRoot,
      idToName,
      objToQueryParams,
      parseFilesByFolderList,
      parseResFromBatchRequests,
      singleReq;

    FilesApp.name = "FilesApp";

    function FilesApp(o_) {
      this.url = "https://www.googleapis.com/drive/v3/files";
      this.fields = "";
      this.pageSize = 1000;
      this.headers = {
        Authorization: "Bearer " + (o_ || ScriptApp.getOAuthToken()),
      };
      this.maxSearchFolders = 20;
      this.maxBatchRequests = 100;
      this.additionalQuery =
        "includeItemsFromAllDrives=true&supportsAllDrives=true";
      this.sharedDriveId = "";
    }

    FilesApp.prototype.getFilesAndFoldersInFolder = function (
      parent,
      mimeTypeList,
      fields
    ) {
      var mtlq, query;
      if (!parent || parent === "") {
        throw new Error("Folder ID was not found.");
      }
      mtlq = getQueryFromMimeTypes.call(this, mimeTypeList);
      parent = parent === "root" ? getRoot.call(this) : parent;
      query = {
        maxResults: this.pageSize,
        q:
          mtlq !== ""
            ? "'" +
              parent +
              "' in parents" +
              " and " +
              mtlq +
              " and trashed=false"
            : "'" + parent + "' in parents and trashed=false",
        fields: fields,
      };
      this.sharedDriveId = getDriveId.call(this, parent);
      if (this.sharedDriveId) {
        query.corpora = "drive";
        query.driveId = this.sharedDriveId;
        this.additionalQuery += "&corpora=drive&driveId=" + this.sharedDriveId;
      }
      return singleReq.call(this, query);
    };

    FilesApp.prototype.getAllFoldersInFolder = function (parent) {
      var allFolders, query;
      if (!parent || parent === "") {
        throw new Error("Folder ID was not found.");
      }
      parent = parent === "root" ? getRoot.call(this) : parent;
      query = {
        pageSize: this.pageSize,
        q: "mimeType='application/vnd.google-apps.folder'",
        fields: "files(id,name,parents),nextPageToken",
      };
      this.sharedDriveId = getDriveId.call(this, parent);
      if (this.sharedDriveId) {
        query.corpora = "drive";
        query.driveId = this.sharedDriveId;
        this.additionalQuery += "&corpora=drive&driveId=" + this.sharedDriveId;
      }
      allFolders = singleReq.call(this, query);
      return getAllFoldersInFolderMain.call(
        this,
        parent,
        idToName.call(this, parent, "name"),
        allFolders
      );
    };

    FilesApp.prototype.getAllInFolder = function (parent, mimeTypes, fields) {
      var folderList;
      this.fields = fields;
      folderList = this.getAllFoldersInFolder(parent);
      return getFilesInFolder.call(this, folderList.id, mimeTypes);
    };

    FilesApp.prototype.createTree = function (parent, mimeTypes, fields) {
      var allFiles, folderList;
      folderList = this.getAllFoldersInFolder(parent);
      this.fields = checkFields.call(this, fields);
      allFiles = getFilesInFolder.call(this, folderList.id, mimeTypes);
      return parseFilesByFolderList.call(this, allFiles, folderList);
    };

    getAllFoldersInFolderMain = function (folderId, folderName, folderList) {
      return (function () {
        var c;
        return (c = function (folder, folderName, folderSt, res) {
          var ar, arrayFolderSt;
          ar = folderList.filter(function (e) {
            return e.parents && e.parents[0] === folder;
          });
          folderSt += `${folderName}#_foohoge_#${folder}#_aabbccddee_#`;
          arrayFolderSt = folderSt.split("#_aabbccddee_#");
          arrayFolderSt.pop();
          res.name.push(
            arrayFolderSt.map(function (e) {
              return e.split("#_foohoge_#")[0];
            })
          );
          res.id.push(
            arrayFolderSt.map(function (e) {
              return e.split("#_foohoge_#")[1];
            })
          );
          ar.length === 0 && (folderSt = "");
          ar.forEach(function (e) {
            c(e.id, e.name, folderSt, res);
          });
          return res;
        })(folderId, folderName, "", {
          id: [],
          name: [],
        });
      })();
    };

    getFilesInFolder = function (folderList, mimeTypeList) {
      var fl, folLen, i, k, mtlq, offset, qs, ref, rq, sep, urls;
      if (folderList.length === 0) {
        throw new Error("No folderList.");
      }
      fl = folderList.map(function (e) {
        return e[e.length - 1];
      });
      mtlq = getQueryFromMimeTypes.call(this, mimeTypeList);
      qs = [];
      folLen = fl.length;
      if (folLen > this.maxSearchFolders) {
        sep = Math.floor(folLen / this.maxSearchFolders);
        sep = folLen % this.maxSearchFolders > 0 ? sep + 1 : sep;
        for (
          i = k = 0, ref = sep;
          0 <= ref ? k < ref : k > ref;
          i = 0 <= ref ? ++k : --k
        ) {
          offset = i * this.maxSearchFolders;
          qs.push(
            createQ.call(
              this,
              fl.slice(offset, offset + this.maxSearchFolders),
              mtlq
            )
          );
        }
      } else {
        qs.push(createQ.call(this, fl, mtlq));
      }
      urls = getFilesByAPIInit.call(this, qs);
      rq = createRequests.call(this, urls);
      return getFilesByAPIByFetchAll.call(this, rq[0], [], rq[1]);
    };

    createRequests = function (urls) {
      var i, k, offset, ref, reqForFetchApp, reqs, sep, urlBk, urlsLen, urlss;
      reqForFetchApp = [];
      urlBk = [];
      urlsLen = urls.length;
      if (urlsLen < this.maxBatchRequests) {
        urlBk.push(urls);
        reqs = createBatchRequests.call(this, urls);
        reqForFetchApp.push(reqs);
      } else {
        sep = Math.floor(urlsLen / this.maxBatchRequests);
        sep = urlsLen % this.maxBatchRequests > 0 ? sep + 1 : sep;
        for (
          i = k = 0, ref = sep;
          0 <= ref ? k < ref : k > ref;
          i = 0 <= ref ? ++k : --k
        ) {
          offset = i * this.maxBatchRequests;
          urlss = urls.slice(offset, offset + this.maxBatchRequests);
          urlBk.push(urlss);
          reqs = createBatchRequests.call(this, urlss);
          reqForFetchApp.push(reqs);
        }
      }
      return [reqForFetchApp, urlBk];
    };

    getFilesByAPIInit = function (qs) {
      return qs.map(
        (function (_this) {
          return function (q) {
            var query;
            query = {
              pageSize: _this.pageSize,
              q: q,
              fields: _this.fields,
            };
            return (
              _this.url +
              "?" +
              objToQueryParams.call(_this, query) +
              "&" +
              _this.additionalQuery
            );
          };
        })(this)
      );
    };

    singleReq = function (query) {
      var params, req;
      params = objToQueryParams.call(this, query);
      req = {
        method: "get",
        url: this.url + "?" + params + "&" + this.additionalQuery,
        headers: this.headers,
        muteHttpExceptions: true,
      };
      return getFilesByAPIByFetchAllforNoBatch.call(this, [req], []);
    };

    getFilesByAPIByFetchAll = function (reqs, fileList, urlBk) {
      var err, ntoken, response, rq, urls;
      response = UrlFetchApp.fetchAll(reqs);
      err = response.filter(function (e) {
        return e.getResponseCode() !== 200;
      });
      if (err.length > 0) {
        throw new Error(
          err.length + " errors occurred. ErrorMessage: " + err.toString()
        );
        return;
      }
      ntoken = [];
      response.forEach(function (e, i) {
        var res;
        res = parseResFromBatchRequests.call(this, e.getContentText());
        res.forEach(function (f, j) {
          var token;
          if (f.status !== 200) {
            throw new Error("It's incomplete data. Status is " + f.status);
            return;
          }
          Array.prototype.push.apply(fileList, f.object.files);
          token = f.object.nextPageToken;
          if (token) {
            ntoken.push([i, j, encodeURIComponent(token)]);
          }
        });
      });
      if (ntoken.length > 0) {
        urls = ntoken.map(function (e) {
          var url;
          url = urlBk[e[0]][e[1]];
          if (~url.indexOf("pageToken=")) {
            url = url.replace(
              /pageToken=[\\W]+?(?=[&|\n])/,
              "pageToken=" + e[2]
            );
          } else {
            url += "&pageToken=" + e[2];
          }
          return url;
        });
        rq = createRequests.call(this, urls);
        getFilesByAPIByFetchAll.call(this, rq[0], fileList, rq[1]);
      }
      return fileList;
    };

    getFilesByAPIByFetchAllforNoBatch = function (reqs, fileList) {
      var err, ntoken, reqss, res;
      res = UrlFetchApp.fetchAll(reqs);
      err = res.filter(function (e) {
        return e.getResponseCode() !== 200;
      });
      if (err.length > 0) {
        throw new Error(
          err.length + " errors occurred. ErrorMessage: " + err.toString()
        );
        return;
      }
      ntoken = [];
      res.forEach((e, i) => {
        var token;
        r = JSON.parse(e.getContentText());
        Array.prototype.push.apply(fileList, r.files);
        token = r.nextPageToken;
        if (token) {
          ntoken.push([i, encodeURIComponent(token)]);
        }
      });
      if (ntoken.length > 0) {
        reqss = ntoken.map(function (e) {
          var req;
          req = reqs.filter(function (f, j) {
            return j === e[0];
          });
          if (~req[0].url.indexOf("pageToken=")) {
            req[0].url = req[0].url.replace(
              /pageToken=[\\W]+?(?=[&|\n])/,
              "pageToken=" + e[1]
            );
          } else {
            req[0].url += "&pageToken=" + e[1];
          }
          return req[0];
        });
        getFilesByAPIByFetchAllforNoBatch.call(this, reqss, fileList);
      }
      return fileList;
    };

    getRoot = function () {
      return idToName.call(this, "root", "id");
    };

    createQ = function (fl, mtlq) {
      var ffs, ffsq;
      ffs = fl.map(function (e) {
        return "'" + e + "' in parents";
      });
      ffsq = "(" + ffs.join(" or ") + ")";
      if (mtlq !== "") {
        return ffsq + " and " + mtlq + " and trashed=false";
      } else {
        return ffsq + " and trashed=false";
      }
    };

    objToQueryParams = function (query) {
      return Object.keys(query)
        .filter(function (e) {
          return query[e];
        })
        .map(function (e) {
          return e + "=" + encodeURIComponent(query[e]);
        })
        .join("&");
    };

    getQueryFromMimeTypes = function (mimeTypeList) {
      var mimetypes;
      if (!mimeTypeList || mimeTypeList.length === 0) {
        mimeTypeList = ["*"];
      }
      if (mimeTypeList.indexOf("*") > -1) {
        mimetypes = "";
      } else {
        mimetypes = mimeTypeList.map(function (e) {
          return "mimeType='" + e + "'";
        });
      }
      if (mimetypes !== "") {
        return "(" + mimetypes.join(" or ") + ")";
      } else {
        return "";
      }
    };

    checkFields = function (fields) {
      var pos;
      if (fields === "" || fields === "undefined" || fields == null) {
        fields = "files(id,name,parents),nextPageToken,kind";
      } else {
        if (!~fields.indexOf("nextPageToken")) {
          fields = fields + ",nextPageToken";
        }
        if (
          ~fields.indexOf("(") &&
          ~fields.indexOf(")") &&
          !~fields.indexOf("parents")
        ) {
          pos = fields.indexOf(")");
          fields =
            fields.slice(0, pos) +
            ",parents" +
            fields.slice(pos, fields.length);
        }
      }
      return fields;
    };

    parseFilesByFolderList = function (allFiles, folderList) {
      var allValues, filesLen, foldersLen;
      filesLen = allFiles.length;
      foldersLen = folderList.id.length;
      if (filesLen === 0) {
        return {
          folderTree: folderList,
          filesInFolder: [],
        };
      }
      allValues = folderList.id.map(function (e, i) {
        return {
          folderTreeById: e,
          folderTreeByName: folderList.name[i],
          filesInFolder: allFiles.filter(function (f) {
            var ok;
            ok = f.parents.filter(function (g) {
              return g === e[e.length - 1];
            });
            return ok.length > 0;
          }),
        };
      });
      return {
        topFolderId: folderList.id[0],
        topFolderName: folderList.name[0],
        totalFilesAndFolders: filesLen,
        totalFiles: filesLen - foldersLen,
        totalFolders: foldersLen,
        files: allValues,
      };
    };

    createBatchRequests = function (endpoints) {
      var boundary, contentId, data, lb;
      boundary = "xxxxxFilesAppxxxxx";
      lb = "\r\n";
      contentId = 0;
      data = "--" + boundary + lb;
      endpoints.forEach(function (endpoint) {
        data += "Content-Type: application/http" + lb;
        data += "Content-ID: " + ++contentId + lb + lb;
        data += "GET " + endpoint + lb + lb;
        data += "--" + boundary + lb;
      });
      return {
        method: "post",
        url: "https://www.googleapis.com/batch/drive/v3",
        headers: this.headers,
        contentType: "multipart/mixed; boundary=" + boundary,
        payload: data,
        muteHttpExceptions: true,
      };
    };

    parseResFromBatchRequests = function (res) {
      var splittedRes;
      splittedRes = res.split("--batch");
      return splittedRes.slice(1, splittedRes.length - 1).map((e) => {
        return {
          contentId: Number(e.match(/Content-ID: response-(\d+)/)[1]),
          status: Number(e.match(/HTTP\/\d+.\d+ (\d+)/)[1]),
          object: JSON.parse(e.match(/{[\S\s]+}/)[0]),
        };
      });
    };

    idToName = function (id, prop) {
      var req, res;
      req = {
        method: `get`,
        url: `${this.url}/${id}?${this.additionalQuery}`,
        headers: this.headers,
        muteHttpExceptions: true,
      };
      res = UrlFetchApp.fetchAll([req]);
      if (res[0].getResponseCode() !== 200) {
        throw new Error(
          `Errors occurred. ErrorMessage: ${res[0].getContentText()}`
        );
        return;
      }
      return JSON.parse(res[0].getContentText())[prop];
    };

    getDriveId = function (id) {
      var req, res;
      req = {
        method: "get",
        url: this.url + "/" + id + "?" + this.additionalQuery,
        headers: this.headers,
        muteHttpExceptions: true,
      };
      res = UrlFetchApp.fetchAll([req]);
      if (res[0].getResponseCode() !== 200) {
        throw new Error(
          "Errors occurred. ErrorMessage: " + res[0].getContentText()
        );
        return;
      }
      return JSON.parse(res[0].getContentText()).driveId || "";
    };

    return FilesApp;
  })();
  return (r.FilesApp = FilesApp);
})(this);

/**
 * Returns a Google Drive folder in the same location 
 * in Drive where the spreadsheet is located. First, it checks if the folder
 * already exists and returns that folder. If the folder doesn't already
 * exist, the script creates a new one. The folder's name is set by the
 * "OUTPUT_FOLDER_NAME" variable from the Code.gs file.
 *
 * @param {string} folderName - Name of the Drive folder. 
 * @return {object} Google Drive Folder
 */
function getFolderByName(folderName) {

  // Gets the Drive Folder of where the current spreadsheet is located.
  const ssId = SpreadsheetApp.getActiveSpreadsheet().getId();
  const parentFolder = DriveApp.getFileById(ssId).getParents().next();

  // Iterates the subfolders to check if the PDF folder already exists.
  const subFolders = parentFolder.getFolders();
  while (subFolders.hasNext()) {
    let folder = subFolders.next();

    // Returns the existing folder if found.
    if (folder.getName() === folderName) {
      return folder;
    }
  }
  // Creates a new folder if one does not already exist.
  return parentFolder.createFolder(folderName)
    .setDescription(`Created by Apps Script`);
}

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

/* Written by Amit Agarwal on August 9, 2013 */

function doGet() {
  var output = HtmlService.createHtmlOutputFromFile("labnol");
  output.setTitle("Publish Website on Google Drive");
  return output;
}

function uploadWebsite(form) {
  try {
    var zip,
      files,
      name,
      folder,
      file,
      host,
      found = false;

    zip = form.zipFile.setContentType("application/zip");
    files = Utilities.unzip(zip);

    // Unique folder name based on the current date and time
    name = Utilities.formatDate(new Date(), "GMT", "ddMMyyyyHHmmss");
    folder = DriveApp.createFolder("Website #" + name);

    for (var i = 0; i < files.length; i++) {
      file = folder.createFile(files[i]);
      if (file.getName() === "index.html") {
        found = true;
      }
    }

    if (found) {
      // Set the sharing permissions of the Drive folder as Public
      folder.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
      var site = "https://googledrive.com/host/" + folder.getId() + "/";
      return (
        'Your <a href="' +
        site +
        '" target="_blank">website</a> is now live on Google Drive. The URL is: ' +
        site
      );
    } else {
      // if the index.html file is not available, don't publish the website
      DriveApp.removeFolder(folder);
    }

    return "Sorry, we couldn't find an index.html in your zip file. Please try again.";
  } catch (e) {
    return e.toString();
  }
}

function csvFileToObjectArray(csvFileId) {
  return DriveApp.getFileById(csvFileId).getBlob().getDataAsString();
}

const propService = {
  scriptProps: {
    /**
     * @method write()
     * @name propService.scriptProps.write()
     * @description Writes the given object's key/value pairs to script properties
     * @param object {object}
     * @example object = {key, value}
     * @return {object} The object parameter for chaining
     */
    write: (object = {}) => {
      try {
        if (!Object.keys(object).length) {
          throw new Error(`The "object" parameter is empty or undefined`);
        }
        const scrptProps = PropertiesService.getScriptProperties();
        Object.keys(object).forEach((key) =>
          scrptProps.setProperty(key, object[key])
        );
        return object;
      } catch (error) {
        console.error(
          `Error in propService.scriptProps.write: ${error.message}`
        );
        return { error: error.message };
      }
    },
    /**
     * @method read()
     * @name propService.scriptProps.read()
     * @description Reads properties with the given keys the given object to script properties and writes them to the object parameter.
     * @param {object} object - An object that contains all the key to be looked up with placeholder values
     * @example object = {key, value}
     * @return {object} The object parameter for chaining
     */
    read: (object = {}) => {
      try {
        if (!Object.keys(object).length) {
          throw new Error(`The "object" parameter is empty or undefined`);
        }
        const scrptProps = PropertiesService.getScriptProperties();
        Object.keys(object).forEach(
          (key) => (object[key] = scrptProps.getProperty(key))
        );
        return object;
      } catch (error) {
        console.error(
          `Error in propService.scriptProps.read: ${error.message}`
        );
        return { error: error.message };
      }
    },
  },
  userProps: {
    /**
     * @method write()
     * @name propService.userProps.write()
     * @description Writes the given object's key/value pairs to user properties
     * @param {object} object - the object to be written to the user properties in the form of
     * @example object = {key, value}
     * @return {object} The object parameter for chaining
     */
    write: (object = {}) => {
      try {
        if (!Object.keys(object).length) {
          throw new Error(`The "object" parameter is empty or undefined`);
        }
        const usrProps = PropertiesService.getUserProperties();
        Object.keys(object).forEach((key) =>
          usrProps.setProperty(key, object[key])
        );
        return object;
      } catch (error) {
        console.error(`Error in propService.userProps.write: ${error.message}`);
        return { error: error.message };
      }
    },
    /**
     * @method read()
     * @name propService.userProps.read()
     * @description Reads properties with the given keys the given object to user properties and writes them to the object parameter.
     * @param {object} object - An object that contains all the key to be looked up with placeholder values
     * @example object = {key, value}
     * @return {object} The object parameter for chaining
     */
    read: (object = {}) => {
      try {
        if (!Object.keys(object).length) {
          throw new Error(`The "object" parameter is empty or undefined`);
        }
        const usrProps = PropertiesService.getUserProperties();
        Object.keys(object).forEach(
          (key) => (object[key] = usrProps.getProperty(key))
        );
        return object;
      } catch (error) {
        console.error(`Error in propService.userProps.read: ${error.message}`);
        return { error: error.message };
      }
    },
  },
  docProps: {
    /**
     * @method write()
     * @name propService.scriptProps.write()
     * @description Writes the given object's key/value pairs to script properties
     * @param object {object}
     * @example object = {key, value}
     * @return {object} The object parameter for chaining
     */
    write: (object = {}) => {
      try {
        if (!Object.keys(object).length) {
          throw new Error(`The "object" parameter is empty or undefined`);
        }
        const scrptProps = PropertiesService.getScriptProperties();
        Object.keys(object).forEach((key) =>
          scrptProps.setProperty(key, object[key])
        );
        return object;
      } catch (error) {
        console.error(
          `Error in propService.scriptProps.write: ${error.message}`
        );
        return { error: error.message };
      }
    },
    /**
     * @method read()
     * @name propService.docProps.read()
     * @description Reads properties with the given keys the given object to script properties and writes them to the object parameter.
     * @param {object} object - An object that contains all the key to be looked up with placeholder values
     * @example object = {key, value}
     * @return {object} The object parameter for chaining
     */
    read: (object = {}) => {
      try {
        if (!Object.keys(object).length) {
          throw new Error(`The "object" parameter is empty or undefined`);
        }
        const scrptProps = PropertiesService.getScriptProperties();
        Object.keys(object).forEach(
          (key) => (object[key] = scrptProps.getProperty(key))
        );
        return object;
      } catch (error) {
        console.error(
          `Error in propService.scriptProps.read: ${error.message}`
        );
        return { error: error.message };
      }
    },
  },
};

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