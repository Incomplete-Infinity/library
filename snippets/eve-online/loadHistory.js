/**
 * Gets market history for a given type Id from esi.evetech.net and calculates
 * the average price, average volume, and total volume for each over a given
 * number of days
 *
 * @param   {Number}    typeId
 * @param   {Number}    historyDays
 * @param   {Boolean}   showHeaders
 * @return  {Array}
 */
function loadHistory(
	typeId = 19,
	days = 7,
	regionId = 10000002,
	showHeaders = false
) {
	// check if showHeaders is true
	if (showHeaders) {
		// if so, make the headers and push them to the array
		results.push([
			`${days} Day Average Price`,
			`${days} Day Average Volume`,
			`${days} Day Total Volume`,
		]);
	}
	// declare variables to hold the data points
	let totalCost = 0;
	let totalVolume = 0;
	let avgPrice = 0;
	let avgVolume = 0;
	// assemble the Url
	const fetchUrl = `https://esi.evetech.net/latest/markets/${regionId}/history/?datasource=tranquility&type_Id=${typeId}`;
	// request from the Url through cacheUrlFetchApp_()
	const response = cacheUrlFetchApp_(fetchUrl);
	// parse the response as JSON
	const json = JSON.parse(response);
	// check if anything was parsed
	if (json) {
		// if so, sort the array by each object`s date
		json.sort((a, b) => {
			return a.date > b.date ? -1 : 1;
		});
		// slice out the requested dates
		const jsonSlice = json.slice(0, historyDays);
		// remove the entries from json to save memory
		json.length = 0;
		// iterate over the objects in the array
		jsonSlice.forEach((day, index) => {
			const dayCount = index + 1;
			// math
			(() => {
				// calculate running total
				totalCost += day.average * day.volume;
				// calculate running total volume
				totalVolume += day.volume;
				// calculate running average price
				avgPrice = Math.round((totalCost / totalVolume) * 100) / 100;
				// calculate average volume
				avgVolume = Math.round(((totalVolume / dayCount) * 100) / 100);
			})();
		});
		// remove entries from jsonSlice to save memory
		jsonSlice.length = 0;
	}
	// lookup type info by calling lookupType_Id()
	const type = lookupType_(typeId);
	// return results
	return [type.name, avgPrice, avgVolume, totalVolume];
}
