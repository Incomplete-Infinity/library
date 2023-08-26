function test() {
  console.log(getFleetMemberNames());
}

const ss = SpreadsheetApp;
const sheet = ss.getActiveSpreadsheet();

/**
 * getFleetData
 */
function getFleetData() {
  return swagger.characters.character.fleet();
}

/**
 * getFleetID
 */
function getFleetID() {
  const { fleet_id } = getFleetData();
  return fleet_id;
}

/**
 * getFleetMemberIDs
 */
function getFleetMemberIDs() {
  return swagger.fleets.fleet.members(getFleetID()).map(member => member.character_id);
}

/**
 * getFleetMemberData
 */
function getFleetMemberData() {
  return swagger.universe.names(getFleetMemberIDs());
}

/**
 * update the list of fleet member IDs
 */
function updateRoster() {
  // declare sheet named roster
  const roster = sheet.getSheetByName(`Roster`);
  // determine last row
  const lastRow = roster.getLastRow();
  // roster data taken from the 'Roster' sheet else if "lastRow" is not greater than 0, will be [].
  const list = lastRow > 0 ? roster.getRange(1, 1, lastRow, 1).getValues().map(value => value[0]) : [];
  // current fleet members
  const currentFleet = getFleetMemberData().map(member => {
    return [member.id, member.name];
  });
  // filter "currentFleet" for members who do not appear in "list"
  const uniqueRoster = currentFleet.filter(member => !list.includes(member[0]));
  // write the results in the 'Roster' sheet on a new line
  uniqueRoster.length > 0 && roster.getRange(lastRow + 1, 1, uniqueRoster.length, 2).setValues(uniqueRoster);
}

/**
 * uncheck all the boxes but leave the roster
 */
function uncheckAllBoxes() {

}
/**
 * when a new site is added, check all the boxes under checked boxes within that row
 */