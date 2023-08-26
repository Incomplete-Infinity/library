# `getEveMarketerData()`

## Summary

### Code

```js
/**
 * This function retrieves market data for a list of item IDs from the EveMarketer API.
 * @param typeIDs - An array of EVE Online item type IDs for which market data is requested.
 * @param [regionID=10000002] - The ID of the region to retrieve market data for. The default value is
 * 10000002, which corresponds to the region of The Forge in EVE Online.
 * @param [systemId=false] - The ID of the solar system to retrieve market data for. If not specified,
 * market data for the entire region will be retrieved instead.
 * @returns An array of fetch requests.
 */
function getEveMarketerData_(typeIDs, regionID = 10000002, systemId = false) {
	// Jita: 30000142
	const result = [];

	const domain = `https://api.evemarketer.com`;
	const subDirectory = `/ec/marketstat/json`;

	const chunkSize = 100;
	try {
		if (typeIDs.length == 0) {
			throw new Error(
				`Required parameter, "typeIDs" is not defined!`
			);

		} else {
			do {
				const length = typeIDs.length;
				const chunk = length > chunkSize ? chunkSize : length;
				const encodedTypes = typeIDs.splice(0, chunk).join(`&typeid=`);
				const query = systemId ? `${encodedTypes}?typeid=&usesystem=${systemID}` : `${encodedTypes}?typeid=&regionlimit=${regionID}` ;

				const url = `${domain}${subDirectory}${query}`;
				result.push(
					fetch(url)
				);
			} while (typeIDs.length > 0);
		}

	} catch (error) {
		console.error(error.message);

	} finally {
		return result;
	}
}
```
