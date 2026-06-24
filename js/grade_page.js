const VALID_GRADES = ["S", "A", "B", "C", "D", "E", "F"];

const GRADE_POINTS = {
  S: 10,
  A: 9,
  B: 8,
  C: 7,
  D: 6,
  E: 5,
  F: 0
};

let cachedGradeMap = null;
let isFetchingCredits = false;

function getCurrentSemester() {
  const select = document.getElementById("semesterSubId");
    if (!select) return null;
    const semesterID = select.value;
    const semesterName = select.options[select.selectedIndex].text;
    if(semesterName==="-- Choose Semester --") return null;
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
function loadCreditsAndCalculateGPA() {
  const semester = getCurrentSemester();
  if (!semester) return;

  // Use cached grade map if available
  let gradeMap = cachedGradeMap;
  cachedGradeMap = null;

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
    if (!data || !data[semester]) {
      // console.log("Credits not found for semester:", semester);
      removeExistingGPARow();
      return;
    }

    const { courseCodes, credits } = data[semester];
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

// Listen for semester change
function watchGradesPageSemesterChange() {
  // console.log("called watch semester change");
  const select = document.getElementById("semesterSubId");
  // console.log(select);
  if (!select) return;
  // console.log("select found");
  setTimeout(loadCreditsAndCalculateGPA, 1000); 
}

// Initialize Grade Page
function initGradePage() {
  // console.log("Grade page initialized");
  watchGradesPageSemesterChange();
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


// Direct timetable API fetch (replaces hidden window)
async function fetchCreditsFromTimetableAPI(semesterId) {
  if (isFetchingCredits) {
    // console.log("Already fetching credits, skipping");
    return;
  }
  isFetchingCredits = true;

  try {
    const csrf = getCsrfToken();
    const regNo = getRegisterNumber();

    const response = await fetch(
      "https://vtop.vitap.ac.in/vtop/processViewTimeTable",
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

    if (rows.length < 5) {
      // console.log("No credits data in response");
      showGPAAfterFetchFailure();
      return;
    }

    const courseCodes = [];
    const credits = [];

    // Skip headers (rows 0-1) & footer (last 2 rows)
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
      // console.log("No credits extracted from timetable API");
      showGPAAfterFetchFailure();
      return;
    }

    // Store credits in chrome.storage.local
    storeCreditsArrays(semesterId, courseCodes, credits, () => {
      // console.log("Credits stored successfully for semester:", semesterId);
      loadCreditsAndCalculateGPA();
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


// Credit orchestration (modified to use direct API)
function ensureCreditsAndCalculate(semesterId) {
  // Don't proceed if no grades are displayed
  const gradeMap = extractGradeMap();
  if (Object.keys(gradeMap).length === 0) {
    // console.log("No grades found in table, aborting credit fetch");
    return;
  }

  cachedGradeMap = gradeMap;

  getData('creditsBySemester', (data) => {
    if (data && data[semesterId]) {
      // Validate stored course codes match this semester's grade page courses
      const stored = data[semesterId];
      const hasMatch = Array.isArray(stored.courseCodes) &&
        stored.courseCodes.some(code => gradeMap[code] !== undefined);

      if (hasMatch) {
        // console.log("Credits already available and match grade page");
        showCalculatingMessage();
        initGradePage();
        return;
      }

      // console.log("Stored credits don't match current semester's courses, re-fetching");
      delete data[semesterId];
      saveData("creditsBySemester", data, () => {
        showCalculatingMessage();
        fetchCreditsFromTimetableAPI(semesterId);
      });
      return;
    }

    // console.log("Credits missing, fetching from timetable API");
    showCalculatingMessage();
    fetchCreditsFromTimetableAPI(semesterId);
  });
}

// Message listeners
chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "exam_grade") {
    const semesterId = getCurrentSemester();
    if(semesterId===null) return;
    ensureCreditsAndCalculate(semesterId);
  }
});


