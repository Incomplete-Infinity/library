function getPortrait(corpId, size = 128) {
	const url = `https://images.evetech.net/corporations/${corpId}/logo?size=${size}`
	
	return url;
}