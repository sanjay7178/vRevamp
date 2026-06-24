function getCurrentSemesterID() {
    const select = document.getElementById("semesterSubId");
    if (!select) return null;
    return select.value;
}

function extractCreditsDetails() {
    const tableBody = document.querySelector("#studentDetailsList .table-responsive .table tbody");
    if (!tableBody) {
        // console.log("Credits table body not found");
        return;
    }

    const rows = tableBody.querySelectorAll("tr");
    const result = extractCreditsFromTableRows(rows);
    if (!result) {
        // console.log("No credits data found in timetable table");
        return;
    }

    const semester = getCurrentSemesterID();
    if (!semester) {
        // console.log("No semester selected, skipping credit storage");
        return;
    }

    storeCreditsArrays(semester, result.courseCodes, result.credits, () => {
        // console.log("Credits stored successfully for semester:", semester);
    });
}

// Message listeners
chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "timetable_view_page") {
        extractCreditsDetails();
    }
});
