const VALID_GRADES = ["S", "A", "B", "C", "D", "E", "F", "N"];

const GRADE_POINTS = {
  S: 10,
  A: 9,
  B: 8,
  C: 7,
  D: 6,
  E: 5,
  F: 0,
  N: 0
};

let isFetchingCredits = false;

function getCurrentSemesterId() {
  const select = document.getElementById("semesterSubId");
  if (!select) return null;

  const semesterID = select.value;

  const selectedOption = select.options[select.selectedIndex];
  if (!selectedOption) return null;

  const semesterName = selectedOption.text;
  if (semesterName === "-- Choose Semester --") return null;

  // console.log("Current Semester in Grades page:", semesterName);
  return semesterID;
}

// Extract grades from table
function extractGradeMap() {
  const rows = document.querySelectorAll("#studentGradeView > div > div > div.row > div > div > div > table > tbody > tr");

  const gradeMap = {};

  for (let i = 2; i < rows.length; i++) { // skip header
    const cols = rows[i].querySelectorAll("td");

    // Current VTOP grade table has 7 columns (excluding View Mark column)
    if (cols.length < 7) continue;

    const courseCode = cols[1].innerText.trim();
    const grade = cols[6].innerText.trim();

    gradeMap[courseCode] = grade;
    // console.log(`Extracted grade for ${courseCode}: ${grade}`);
  }

  return gradeMap;
}

// Calculate GPA using arrays of course codes and credits
function calculateGPA(courseCodes, credits, gradeMap) {
  let numerator = 0;
  let totalCredits = 0;

  for (let i = 0; i < courseCodes.length; i++) {
    const courseCode = courseCodes[i];
    const credit = credits[i];

    const gradeLetter = gradeMap[courseCode];
    if (!VALID_GRADES.includes(gradeLetter)) continue;

    numerator += (credit * GRADE_POINTS[gradeLetter]);
    totalCredits += credit;
  }

  if (totalCredits === 0) return "-";
  const gpa = (numerator / totalCredits);
  // console.log(gpa);
  return gpa;
}

function showCalculatingMessage() {
  const tbody = document.querySelector("#studentGradeView table tbody");
  if (!tbody) return;

  removeExistingGPARow();

  const loadingRow = document.createElement('tr');
  loadingRow.id = 'vrevamp-gpa-row';
  loadingRow.style.backgroundColor = "rgba(170,255,0,0.6)";
  loadingRow.innerHTML = '<td colspan="8" style="text-align:center;font-weight:bold">GPA: Calculating...</td>';
  tbody.appendChild(loadingRow);
  // console.log("GPA: Calculating...");
}

// Read credits from storage
function loadCreditsAndCalculateGPA(gradeMapOverride) {
  const semesterId = getCurrentSemesterId();
  if (!semesterId) return;

  // Use provided grade map, or extract from DOM
  let gradeMap = gradeMapOverride || null;

  if (!gradeMap) {
    try {
      gradeMap = extractGradeMap();
    } catch (e) {
      // console.error("GPA: Failed to extract grades:", e);
      return;
    }
  }
  // console.log("Grade Map:", gradeMap);

  showCalculatingMessage();

  getData("creditsBySemester", (data) => {
    if (!data || !data[semesterId]) {
      // console.log("Credits not found for semester:", semesterId);
      removeExistingGPARow();
      return;
    }

    const { courseCodes, credits } = data[semesterId];
    // console.log("Course Codes:", courseCodes);
    // console.log("Credits:", credits);

    let gpa;
    try {
      gpa = calculateGPA(courseCodes, credits, gradeMap);
    } catch (e) {
      // console.error("GPA: Calculation failed:", e);
      removeExistingGPARow();
      return;
    }
    renderGPA(Math.floor(gpa * 100) / 100);
  });
}


// Render GPA row
function renderGPA(gpa) {
  const tbody = document.querySelector("#studentGradeView table tbody");
  if(!tbody) return;

  removeExistingGPARow();

  const gpaDisplay = (typeof gpa === "number" && !isNaN(gpa)) ? gpa.toFixed(2) : "N/A";

  const gpaRow = document.createElement('tr');
  gpaRow.id = 'vrevamp-gpa-row';
  gpaRow.style.backgroundColor = "rgba(170,255,0,0.6)";
  gpaRow.innerHTML = `<td colspan="8" style="text-align:center;font-weight:bold">GPA : ${gpaDisplay}</td>`
  tbody.appendChild(gpaRow);
  // console.log("GPA Rendered:", gpaDisplay);
}

function removeExistingGPARow() {
  const existingRow = document.getElementById('vrevamp-gpa-row');
  if (existingRow) existingRow.remove();
}


// Helpers for VTOP API call
function getCsrfToken() {
  const csrfElements = document.getElementsByName("_csrf");
  for (let i = 0; i < csrfElements.length; i++) {
    const el = csrfElements[i];
    if (el && el.defaultValue) {
      return el.defaultValue;
    }
  }
  return "";
}

function getRegisterNumber() {
  // Try VTOP V2 navbar first
  const navbarEl = document.querySelector(".navbar-text.text-light.small.fw-bold");
  if (navbarEl) {
    return navbarEl.innerText.replace("(STUDENT)", "").trim();
  }
  // Fallback: try VTOP V1 header
  const headerEl = document.getElementsByClassName("VTopHeaderStyle");
  if (headerEl.length > 0) {
    return headerEl[0].innerText.replace("(STUDENT)", "").trim();
  }
  return "";
}


// Direct timetable API fetch
async function fetchCreditsFromTimetableAPI(semesterId, gradeMap) {
  if (isFetchingCredits) {
    // console.log("Already fetching credits, skipping");
    return;
  }
  isFetchingCredits = true;

  try {
    const csrf = getCsrfToken();
    const regNo = getRegisterNumber();

    const response = await fetch(
      `${window.location.origin}/vtop/processViewTimeTable`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: new URLSearchParams({
          semesterSubId: semesterId,
          authorizedID: regNo,
          _csrf: csrf,
        }),
      }
    );

    if (!response.ok) {
      console.error("Timetable API returned status:", response.status);
      showGPAAfterFetchFailure();
      return;
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    // Parse the credits table from the response HTML
    const rows = doc.querySelectorAll(
      "#studentDetailsList .table-responsive .table tbody tr"
    );

    const result = extractCreditsFromTableRows(rows);
    if (!result) {
      // console.log("No credits data in response");
      showGPAAfterFetchFailure();
      return;
    }

    // Store credits in chrome.storage.local
    storeCreditsArrays(semesterId, result.courseCodes, result.credits, () => {
      // console.log("Credits stored successfully for semester:", semesterId);
      loadCreditsAndCalculateGPA(gradeMap);
    });

  } catch (e) {
    console.error("Failed to fetch credits from timetable API:", e);
    showGPAAfterFetchFailure();
  } finally {
    isFetchingCredits = false;
  }
}

function showGPAAfterFetchFailure() {
  const tbody = document.querySelector("#studentGradeView table tbody");
  if (!tbody) return;

  removeExistingGPARow();

  const errorRow = document.createElement('tr');
  errorRow.id = 'vrevamp-gpa-row';
  errorRow.style.backgroundColor = "rgba(255,170,170,0.6)";
  errorRow.innerHTML = '<td colspan="8" style="text-align:center;font-weight:bold;color:#cc0000">GPA: Could not fetch credits</td>';
  tbody.appendChild(errorRow);
}


// Credit orchestration
function ensureCreditsAndCalculate(semesterId) {
  // Don't proceed if no grades are displayed
  const gradeMap = extractGradeMap();
  if (Object.keys(gradeMap).length === 0) {
    // console.log("No grades found in table, aborting credit fetch");
    return;
  }

  getData('creditsBySemester', (data) => {
    if (data && data[semesterId]) {
      // console.log("Credits already available for semester:", semesterId);
      loadCreditsAndCalculateGPA(gradeMap);
      return;
    }

    // console.log("Credits missing, fetching from timetable API");
    showCalculatingMessage();
    fetchCreditsFromTimetableAPI(semesterId, gradeMap);
  });
}

// Message listeners
chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "exam_grade") {
    const semesterId = getCurrentSemesterId();
    if(semesterId===null) return;
    ensureCreditsAndCalculate(semesterId);
  }
});
