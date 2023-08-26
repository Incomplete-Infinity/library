/**
 * @name driveWrite 
 * @description Saves the given object in the user's drive with the given title and mime type. Then, it records the fileID of the new file in scriptProperties.
 * @version 2.0.0
 * @date Dec 9, 2022
 * @author PhobiaCide
 * @copyright Andrew Amason 2022 
 * @license MIT
 * @param   {object}  object - the object contiaining the params for this function
 *  @prop   {object}  object.data - in the form { key: `value` } 
 *  @prop   {string}  object.title - the desired fileName
 *  @prop   {string}  object.mimeType - represents the desired file format
 * @see https://developers.google.com/apps-script/reference/base/mime-type
 *
 * @return {null}
 */// TODO (Developer) Add error handling
function saveToDrive({ object = { key: "value" }, title = `untitled`,	mimeType = `application/json` } = options) {
	const fileSets = {
		title,
		mimeType,
	};
	const blob = Utilities.newBlob(
		JSON.stringify(object),
		`application/vnd.google-apps.script+json`
	);
	const file = Drive.Files.insert(fileSets, blob);
  const fileName = `${title}`;
  console.info(
   `File name______________________${fileName},
    File ID________________________${file.id}, 
    File size(bytes)_______________${file.fileSize}, 
    File type______________________${file.mimeType}`
	);
}