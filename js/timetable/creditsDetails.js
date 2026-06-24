function getCurrentSemesterID() {
    const select = document.getElementById("semesterSubId");
    if (!select) return null;
    const semesterID = select.value;
    const semesterName = select.options[select.selectedIndex].text;
    // console.log("Current Semester in Timetable:", semesterName);
    return semesterID;
}


// Extract courseCodes[] and credits[]
function extractCreditsData(rows) {

    const courseCodes = [];
    const credits = [];

    // Skip headers & footer rows
    for (let i = 2; i < rows.length - 2; i++) {
        const cols = rows[i].querySelectorAll("td");
        if (cols.length < 4) continue;

        const courseText = cols[2].innerText.trim();
        const dashIndex = courseText.indexOf("-");
        if (dashIndex === -1) continue;

        const courseCode = courseText.substring(0, dashIndex).trim();

        const creditText = cols[3].innerText.trim();
        const match = creditText.match(/(\d+)\.\d+/);
        if (!match) continue;

        courseCodes.push(courseCode);
        credits.push(Number(match[1]));
    }

    if (!courseCodes.length || !credits.length) {
        return null;
    }

    const semester = getCurrentSemesterID();
    
    storeCreditsArrays(semester, courseCodes, credits);
}

function extractCreditsDetails() {
    const tableBody = document.querySelector("#studentDetailsList .table-responsive .table tbody");
    if (!tableBody) {
        // console.log("Credits table body not found");
        return;
    }
    // console.log(tableBody);
    const rows = tableBody.querySelectorAll('tr');
    extractCreditsData(rows);
};

function watchTimetableSemesterChange() {
    const select = document.getElementById("semesterSubId");
    if (!select) return;
    select.addEventListener("change", () => {
        // console.log("semester change in timetable");
        setTimeout(extractCreditsDetails, 1000);
    });
}

function initTimetablePage() {
    // console.log("timetable page initialized")
    watchTimetableSemesterChange();
}

// Message listeners
chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "timetable_view_page") {
        initTimetablePage();
    }
})
