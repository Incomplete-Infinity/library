/**
 * Gets information on a given type Id from https://esi.evetech.net/latest/universe/types/
 *
 * @param   {Number}    typeId
 * @return
 */
function lookupType(typeId) {
  if (!typeId || typeId == null) {
    throw `Type ID is required!`;
  } else {
    try {
      const response = cacheUrlFetchApp(
        `https://esi.evetech.net/latest/universe/types/${typeId}/?datasource=tranquility&language=en`
      );
      return JSON.parse(response);
    } catch {}
  }
}

/**
 * Gets information on a given array of type Ids by calling
 * lookupType() for each type Id
 *
 * @param   {Array}    typeIds
 * @return
 */
function lookupTypes(typeIds) {
  const data = [];
  typeIds.forEach((typeId) => {
    data.push(lookupType(typeId));
  });
  return data;
}
