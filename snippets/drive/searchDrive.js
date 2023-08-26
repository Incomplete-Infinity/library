function searchDrive() {
  // Log the name of every file in the user's Drive that modified after February 28,
  // 2013 whose name contains "untitled".
  const files = DriveApp.searchFiles(
    'modifiedDate > "2013-02-28" and title contains "untitled"'
  );
  while (files.hasNext()) {
    const file = files.next();
    Logger.log(file.getName());
  }
}
