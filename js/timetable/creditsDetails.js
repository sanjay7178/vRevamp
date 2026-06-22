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
        // console.log("No credits extracted");
        chrome.runtime.sendMessage({
            message: "credits_failed",
            reason: "No credits extracted from table"
        });
        // console.log("Sent credits_failed message");
        return null;
    }

    // console.log("Extracted courseCodes:", courseCodes);
    // console.log("Extracted credits:", credits);
    const semester = getCurrentSemesterID();
    
    // Store credits and wait for confirmation before notifying background
    storeCreditsArrays(semester, courseCodes, credits, () => {
        // console.log("Credits storage confirmed, sending credits_stored message");
        chrome.runtime.sendMessage({
            message: "credits_stored",
            semester,
            success: true
        });
        // console.log("Sent credits_stored message for semester:", semester);
    });
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

function waitForCreditsTable(expectedSemesterId, callback, timeout = 20000) {
    const start = Date.now();

    const observer = new MutationObserver(() => {
        const currentSemester = getCurrentSemesterID();
        const rows = document.querySelectorAll(
            "#studentDetailsList .table-responsive .table tbody tr"
        );

        if (
            currentSemester === expectedSemesterId &&
            rows.length > 4
        ) {
            observer.disconnect();
            // console.log("Credits table ready for semester:", expectedSemesterId);
            callback(rows);
        }

        if (Date.now() - start > timeout) {
            observer.disconnect();
            // console.log("Credits table wait timeout");
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}


function openTimetableFromMenu(callback, attempts = 0) {
    const timetableLink = document.querySelector(
        'a[data-url="academics/common/StudentTimeTable"]'
    );

    if (!timetableLink) {
        if (attempts > 10) {
            // console.log("Timetable menu not found");
            return;
        }
        setTimeout(() => openTimetableFromMenu(callback, attempts + 1), 500);
        return;
    }

    // console.log("Clicking Timetable menu");
    timetableLink.click();
    
    setTimeout(callback, 1000);
}


function selectSemesterAndFetchCredits(semesterId, attempts = 0) {
    const select = document.getElementById("semesterSubId");

    if (!select) {
        if (attempts > 10) return;
        setTimeout(() => selectSemesterAndFetchCredits(semesterId, attempts + 1), 300);
        return;
    }

    // Ensure semester exists in dropdown
    const optionExists = [...select.options]
        .some(opt => opt.value === semesterId);

    if (!optionExists) {
        // console.log("Semester option not found:", semesterId);
        return;
    }

    select.value = semesterId;

    // Trigger VTOP AJAX
    select.dispatchEvent(new Event("change", { bubbles: true }));

    // console.log("Semester selected in timetable:", semesterId);
    waitForCreditsTable(semesterId, (rows) => {
        extractCreditsData(rows);
    });
}


// Message listeners
chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "timetable_view_page") {
        initTimetablePage();
    }
})

chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "open_timetable_and_select_semester") {
        // console.log("received open timetable msg with semesterId:", request.semesterId)
        openTimetableFromMenu(() => {
            // console.log("Calling selectSemesterAndFetchCredits with semesterId:", request.semesterId);
            selectSemesterAndFetchCredits(request.semesterId);
        });
    }
});


