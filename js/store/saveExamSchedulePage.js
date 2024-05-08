const examScheduleKey = "exam-schedule-V1"

/**
 * Save the marks page data
 * @param {string} tableHtmlObjectString - The marks page data
 * @returns {void}
 */
function saveExamSchedulePage(tableHtmlObjectString) {
  saveData(examScheduleKey, tableHtmlObjectString);
}

/**
  * Get the marks page data 
  * @param {function(string)} callback - The callback function to be called after the data is retrieved
  * @returns {void}
*/
function getExamSchedulePage(callback) {
  getData(examScheduleKey, callback);
}
