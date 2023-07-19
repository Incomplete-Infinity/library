function csvFileToObjectArray(csvFileId) {
  const csvData = DriveApp.getFileById(csvFileId).getBlob().getDataAsString();

  return csvDataToObjectArray(csvData);
}

function csvDataToObjectArray(csvData) {
  const [headerRow, ...dataRows] = csvData
    .split("\n")
    .map((row) => row.split(","));

  return dataRows.map((dataRow) =>
    headerRow.reduce(
      (obj, key, index) => ({ ...obj, [key]: dataRow[index] }),
      {}
    )
  );
}

const debounce = (mainFunction, delay) => {
  // Declare a variable called 'timer' to store the timer ID
  let timer;

  // Return an anonymous function that takes in any number of arguments
  return function (...args) {
    // Clear the previous timer to prevent the execution of 'mainFunction'
    clearTimeout(timer);

    // Set a new timer that will execute 'mainFunction' after the specified delay
    timer = setTimeout(() => {
      mainFunction(...args);
    }, delay);
  };
};

/**
 * @summary Ensures that the input data is a two-dimensional array.
 * @description This function takes an input data and checks if it is a two-dimensional array. If the input data is not an array, it wraps it in a single-element array. If the input data is already a two-dimensional array, it returns the data as-is.
 *
 * @param {*} values - The input data, assumed to be an array of arrays.
 * @returns {Array[]} - The input data as a two-dimensional array.
 */
function ensure2dArray(values) {
  return ensureArray(values).map((value) => ensureArray(value));
}

function ensureArray(data) {
  return [data].flat();
}

function throttle(mainFunction, delay) {
  let timerFlag = null; // Variable to keep track of the timer

  // Returning a throttled version 
  return (...args) => {
    if (timerFlag === null) { // If there is no timer currently running
      mainFunction(...args); // Execute the main function 
      timerFlag = setTimeout(() => { // Set a timer to clear the timerFlag after the specified delay
        timerFlag = null; // Clear the timerFlag to allow the main function to be executed again
      }, delay);
    }
  };
}