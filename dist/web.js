const ss = SpreadsheetApp.getActive();

/**
 * This function decodes URL-encoded strings in a Google Sheets cell.
 * @param {GoogleAppsScript.Spreadsheet.Range} [active=SpreadsheetApp.getActiveRange()] The range to decode.
 * in a Google Sheets spreadsheet. If no range is specified, it defaults to the currently active range.
 * The `active` parameter is used in the `decode` function to get the values of the active range and
 * decode any encoded characters
 */
const decode = (active = ss.getActiveRange()) => {
  const sheet = SpreadsheetApp.getActiveSheet();
  const values = active.getValues().map(([source]) => [decodeURIComponent(source.toString().replace(/\+/g, ' '))]);
  sheet
    .getRange(active.getRow(), active.getColumn(), active.getNumRows(), 1)
    .setValues(values);

  // Browser.msgBox("Decoded: "+ active);
};

const ss = SpreadsheetApp.getActive();

/**
 * This function encodes the values in the active range of a Google Sheets document using
 * encodeURIComponent.
 * @param {GoogleAppsScript.Spreadsheet.Range} [active=SpreadsheetApp.getActiveRange()] The range to encode.
 * function. If it is not provided, the function will use the currently active range in the Google
 * Sheets as the input range to encode. If it is provided, it should be a Range object that represents
 * the input
 */
const encode = (active = ss.getActiveRange()) => {
  const sheet = SpreadsheetApp.getActiveSheet();
  const values = active.getValues().map(([source]) => [encodeURIComponent(source.toString())]);
  sheet
    .getRange(active.getRow(), active.getColumn() + 1, active.getNumRows(), 1)
    .setValues(values);

  // Browser.msgBox("Encoded: "+ active);
};

/**
 * @format
 * @name fetchAllPages
 * @version 1.0.0
 * @date 11/26/2022
 * @author PhobiaCide
 * @license MIT License
 * @copyright © 2022 Andrew Amason
 * @summary Fetches all existing pages of an ESI endpoint response
 * @description Fetches the first page of an Eve Swagger Interface (ESI) api request and determines the total number of pages to be fetched. Then, it fetches them all and returns them as an array of objects.
 * @param {string} url - The address to which to make the api call
 * @param {string} options - Optional standard fetch parameters
 * @return {array}
 */
function fetchAllPages(url, options) {
  /**
   * @constant
   * @alias fetchApiPage
   * @summary Fetches a single response page
   * @description
   * @param {number} page - The number of the desired page
   * @returns {(object|Error)} - The server response or a new error if server response code is anything other than 200
   */
  const fetchApiPage = (page = 1) => {
    /**
     * @constant
     * @alias fetchResponse
     * @summary Makes
     * @returns
     */
    const fetchResponse = () => {
      const response = UrlFetchApp.fetch(`${url}${page}`, options);
      const code = response.getResponseCode();
      return code == 200
        ? response
        : new Error(
            `HTTP request unsuccessful at ${url}${page}, ${options}. Server response: ${response.getResponseCode()}.`
          );
    };
    if (fetchResponse != null) {
      const quantity = fetchResponse.getHeaders()[`x-pages`];
      const json = JSON.parse(fetchResponse.getContentText());

      return page < quantity ? json.concat(fetchApiPage(page + 1)) : json;
    }
  };
  return fetchApiPage();
}

/**
 * @file
 * @summary Simple library for sending OAuth2 authenticated requests.
 * @see https://developers.google.com/google-ads/scripts/docs/features/third-party-apis#oauth_2
 */

/**
 * @function
 * @summary Adds a OAuth object, for creating authenticated requests, to the global object.
 */
(function (scope) {
	/**
	 * @function
	 * @alias OAuth2UrlFetchApp
	 * @summary Creates an object for making authenticated URL fetch requests with a given stored access token.
	 * @param {string} accessToken The access token to store and use.
	 * @constructor
	 */
	function OAuth2UrlFetchApp(accessToken) {
		this.accessToken = accessToken;
	}

	/**
	 * @function
	 * @alias OAuth2UrlFetchApp.prototype.fetch
	 * @summary Performs an HTTP request for the given URL.
	 * @param {string} url The URL to fetch
	 * @param {?Object=} options Options as per UrlFetchApp.fetch
	 * @return {!HTTPResponse} The HTTP Response object.
	 */
	OAuth2UrlFetchApp.prototype.fetch = function (url, opt_options) {
		const fetchOptions = opt_options || {};
		if (!fetchOptions.headers) {
			fetchOptions.headers = {};
		}
		fetchOptions.headers.Authorization = 'Bearer ' + this.accessToken;
		return UrlFetchApp.fetch(url, fetchOptions);
	};

	/**
	 * @function
	 * @alias authenticate
	 * @summary Performs the authentication step
	 * @param {string} tokenUrl The endpoint for use in obtaining the token.
	 * @param {!Object} payload The authentication payload, typically containing details of the grant type, credentials etc.
	 * @param {string=} opt_authHeader Client credential grant also can make use of an Authorisation header, as specified here
	 * @param {string=} opt_scope Optional string of spaced-delimited scopes.
	 * @return {string} The access token
	 */
	function authenticate(tokenUrl, payload, opt_authHeader, opt_scope) {
		const options = { muteHttpExceptions: true, method: 'POST', payload };
		if (opt_scope) {
			options.payload.scope = opt_scope;
		}
		if (opt_authHeader) {
			options.headers = { Authorization: opt_authHeader };
		}
		const response = UrlFetchApp.fetch(tokenUrl, options);
		const responseData = JSON.parse(response.getContentText());
		if (responseData && responseData.access_token) {
			const accessToken = responseData.access_token;
		} else {
			throw Error('No access token received: ' + response.getContentText());
		}
		return accessToken;
	}

	/**
	 * @function
	 * @alias withRefreshToken
	 * @summary Creates a OAuth2UrlFetchApp object having authenticated with a refresh token.
	 * @param {string} tokenUrl The endpoint for use in obtaining the token.
	 * @param {string} clientId The client ID representing the application.
	 * @param {string} clientSecret The client secret.
	 * @param {string} refreshToken The refresh token obtained through previous (possibly interactive) authentication.
	 * @param {string=} opt_scope Space-delimited set of scopes.
	 * @return {!OAuth2UrlFetchApp} The object for making authenticated requests.
	 */
	function withRefreshToken(
		tokenUrl,
		clientId,
		clientSecret,
		refreshToken,
		opt_scope
	) {
		const payload = {
			grant_type: 'refresh_token',
			client_id: clientId,
			client_secret: clientSecret,
			refresh_token: refreshToken,
		};
		const accessToken = authenticate(tokenUrl, payload, null, opt_scope);
		return new OAuth2UrlFetchApp(accessToken);
	}

	/**
	 * @function
	 * @alias withClientCredentials
	 * @summary Creates a OAuth2UrlFetchApp object having authenticated with client credentials.
	 * @param {string} tokenUrl The endpoint for use in obtaining the token.
	 * @param {string} clientId The client ID representing the application.
	 * @param {string} clientSecret The client secret.
	 * @param {string=} opt_scope Space-delimited set of scopes.
	 * @return {!OAuth2UrlFetchApp} The object for making authenticated requests.
	 */
	function withClientCredentials(tokenUrl, clientId, clientSecret, opt_scope) {
		const authHeader =
			'Basic ' + Utilities.base64Encode([clientId, clientSecret].join(':'));
		const payload = {
			grant_type: 'client_credentials',
			client_id: clientId,
			client_secret: clientSecret,
		};
		const accessToken = authenticate(tokenUrl, payload, authHeader, opt_scope);
		return new OAuth2UrlFetchApp(accessToken);
	}

	/**
	 * @function
	 * @alias withPassword
	 * @summary Creates a OAuth2UrlFetchApp object having authenticated with OAuth2 username and password.
	 * @param {string} tokenUrl The endpoint for use in obtaining the token.
	 * @param {string} clientId The client ID representing the application.
	 * @param {string} username OAuth2 Username
	 * @param {string} password OAuth2 password
	 * @param {string=} opt_scope Space-delimited set of scopes.
	 * @return {!OAuth2UrlFetchApp} The object for making authenticated requests.
	 */
	function withPassword(tokenUrl, clientId, username, password, opt_scope) {
		const payload = {
			grant_type: 'password',
			client_id: clientId,
			username,
			password,
		};
		const accessToken = authenticate(tokenUrl, payload, null, opt_scope);
		return new OAuth2UrlFetchApp(accessToken);
	}

	/**
	 * @function
	 * @alias withServiceAccount
	 * @summary Creates a OAuth2UrlFetchApp object having authenticated as a Service Account.
	 * @see https://developers.google.com/identity/protocols/OAuth2ServiceAccount
	 * @param {string} tokenUrl The endpoint for use in obtaining the token.
	 * @param {string} serviceAccount The email address of the Service Account.
	 * @param {string} key The key taken from the downloaded JSON file.
	 * @param {string} scope Space-delimited set of scopes.
	 * @return {!OAuth2UrlFetchApp} The object for making authenticated requests.
	 */
	function withServiceAccount(tokenUrl, serviceAccount, key, scope) {
		const assertionTime = new Date();
		const jwtHeader = '{"alg":"RS256","typ":"JWT"}';
		const jwtClaimSet = {
			iss: serviceAccount,
			scope,
			aud: tokenUrl,
			exp: Math.round(assertionTime.getTime() / 1000 + 3600),
			iat: Math.round(assertionTime.getTime() / 1000),
		};
		const jwtAssertion =
			Utilities.base64EncodeWebSafe(jwtHeader) +
			'.' +
			Utilities.base64EncodeWebSafe(JSON.stringify(jwtClaimSet));
		const signature = Utilities.computeRsaSha256Signature(jwtAssertion, key);
		jwtAssertion += '.' + Utilities.base64Encode(signature);
		const payload = {
			grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
			assertion: jwtAssertion,
		};
		const accessToken = authenticate(tokenUrl, payload, null);
		return new OAuth2UrlFetchApp(accessToken);
	}

	scope.OAuth2 = {
		withRefreshToken,
		withClientCredentials,
		withServiceAccount,
		withPassword,
	};
})(this);

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