const marksPageKey = "mark-V1"

/**
 * Save the marks page data
 * @param {string} tableHtmlObjectString - The marks page data
 * @returns {void}
 */
function saveMarksPage(tableHtmlObjectString) {
  saveData(marksPageKey, tableHtmlObjectString);
}

/**
  * Get the marks page data 
  * @param {function(string)} callback - The callback function to be called after the data is retrieved
  * @returns {void}
*/
function getMarksPage(callback) {
  getData(marksPageKey, callback);
}
