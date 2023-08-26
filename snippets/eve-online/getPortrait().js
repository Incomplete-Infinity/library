function getPortrait(characterId, size = 128) {
	const url = `https://images.evetech.net/characters/${characterId}/portrait?size=${size}`
	
	return url;
}