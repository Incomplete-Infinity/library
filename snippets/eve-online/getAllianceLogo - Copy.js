function getPortrait(allianceId, size = 128) {
	const url = `https://images.evetech.net/alliances/${allianceId}/logo?size=${size}`
	
	return url;
}