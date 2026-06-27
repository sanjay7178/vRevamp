/**
 * Parses course codes and credits from timetable HTML table rows.
 * Shared utility used by both creditsDetails.js (in-page DOM) and
 * grade_page.js (API response parsed via DOMParser).
 *
 * @param {NodeList|HTMLCollection} rows - Table rows from the timetable
 * @returns {{ courseCodes: string[], credits: number[] } | null}
 */
function extractCreditsFromTableRows(rows) {
  if (!rows || rows.length < 5) return null;

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
    const match = creditText.match(/(\d+\.\d+)$/);
    if (!match) continue;

    courseCodes.push(courseCode);
    credits.push(Number(match[1]));
  }

  if (!courseCodes.length || !credits.length) {
    return null;
  }

  return { courseCodes, credits };
}
