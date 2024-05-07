// What actions this `timetable_view_page` performs
// 1. Selects the recent semester
// 2. Compacts the time table into a viewable format which is easier to see. 
// TODO: add colors to the table 
// TODO: A toggle switch for the timetable view
// TODO: add a simple toggle switch for the auto view button


const change_time_table = () => {
  const parent_table = document.getElementById("timeTableStyle");
  if (parent_table === null || parent_table === undefined || parent_table.children.length === 0) return;

  const tbody_table = parent_table.children[0]; // the first element is the <tbody> with data
  const extractedHeader = extract_header(tbody_table.children);
  const extracted_children = extract_tbody_data(tbody_table.children);
  const merged_data = filterRepeatedColumns(extractedHeader, extracted_children)
  const childrenDataArr = merged_data;
  saveTimeTable(extractedHeader, childrenDataArr);
  displayTableData(extractedHeader, childrenDataArr)
};

function displayTableData(headerData, childrenData) {
  // creating the table head
  headerData.splice(0, 1); // remove the first element which is just "starttime-endtime[1,4,9,16,25];"

  const table = createTable(headerData, childrenData);
  insertTable(table);
}

function createTable(header, bodyData) {
  const tdHeader = createTableHead(filterRepeated(header));
  const table = document.createElement("table"); table.className = "styled-table";
  table.appendChild(tdHeader);
  const tBody = document.createElement("tbody");
  const dayIndex = (new Date()).getDay();
  for (let i = 0; i < bodyData.length; i++) {
    let { day, theory: theoryDataArr, lab: labDataArr } = bodyData[i];
    theoryDataArr.splice(0, 1); // remove the first element which is just starttime-endtime 
    labDataArr.splice(0, 1); // remove the first element which is just starttime-endtime
    const tr = createTr(theoryDataArr, labDataArr);
    const day_td = _create_td_element(day, "day-block");
    tr.insertBefore(day_td, tr.children[0]);
    console.log({ dayIndex, i })
    if (dayIndex == toIndex(day)) {
      tr.classList.add("current-day");
    }
    tBody.appendChild(tr);
  }
  table.appendChild(tBody);
  const table_div = document.createElement("div");
  table_div.className = "table-div";
  table_div.appendChild(table);
  return table_div;
}

function toIndex(day) {
  if (day === "MON") return 1;
  if (day === "TUE") return 2;
  if (day === "WED") return 3;
  if (day === "THU") return 4;
  if (day === "FRI") return 5;
  if (day === "SAT") return 6;
  return 0;
}

function insertTable(table_div) {
  // getting the actual div of the timetable
  const timeTableLoader = document.getElementById("loadMyFragment");
  const parent_div = timeTableLoader.parentElement;
  // remove the previous table and download link if it exists
  document.querySelectorAll(".table-div").forEach((div) => { div.remove() });
  document.querySelectorAll(".download-timetable").forEach((a) => a.remove());
  // create a new table div and add the table to it
  parent_div.insertBefore(table_div, timeTableLoader);

  const a = create_download_link("download-timetable"); // className = download-timetable
  domtoimage.toPng(table_div, { quality: 0.99 }).then(
    (blob) => {
      a.download = 'timetable.png';
      a.href = blob;
    }
  );
  parent_div.insertBefore(a, table_div);
}

const MutationObserverConfig = { attributes: true, childList: true, subtree: true };

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "timetable_view_page") {
    try {
      // try to display the timetable data if it exists 
      getTimeTable((d) => {
        displayTableData(d.header, d.data)
      });

      // attaching the observer to the div
      const timeTableDiv = document.getElementById("loadMyFragment");
      const timeTableDivObserver = new MutationObserver((mutationsList, observer) => change_time_table());
      timeTableDivObserver.observe(timeTableDiv, MutationObserverConfig);
    } catch (error) {
      // console.log(error);
      console.error(error)
    }
  }
});
