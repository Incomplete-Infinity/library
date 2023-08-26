function addRoller() {
  const name = getRangeByName(`name`);
  const hot = getRangeByName(`hot`);
  const cold = getRangeByName(`cold`);

  const rollers = getSheetByName(`rollers`);
  const lastRow = rollers.getLastRow();
  const savedNames = rollers.getRange(`A2:A${lastRow}`).getDisplayValues().flat(Infinity);
  if (!savedNames.includes(name)) rollers.appendRow([name, hot, cold]);  
  log('Roller added successfully!');
}