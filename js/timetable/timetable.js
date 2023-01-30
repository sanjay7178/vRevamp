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
    const children_data_arr = extract_tbody_data(tbody_table.children);
    const tdHeader = createTableHead(extract_header(tbody_table.children));
    
    const table = document.createElement("table"); table.className = "styled-table";
    table.appendChild(tdHeader);
    const tBody = document.createElement("tbody");
    for (let i = 0; i < children_data_arr.length; i++) {
        let { day, theory: theoryDataArr, lab: labDataArr } = children_data_arr[i];
        const tr = createTr(theoryDataArr, labDataArr);
        const day_td = _create_td_element(day, "day-block");
        tr.insertBefore(day_td, tr.children[0]);
        tBody.appendChild(tr);
    }
    table.appendChild(tBody);

    const timeTableLoader = document.getElementById("loadMyFragment");
    const parent_div = timeTableLoader.parentElement;
    const table_div = document.createElement("div");
    table_div.className = "table-div";
    table_div.appendChild(table);
    parent_div.insertBefore(table_div, timeTableLoader);
    
    const a = create_download_link();
    // print(table_div);
    domtoimage.toPng(table_div, { quality: 0.99 }).then(
        (blob) => {
            a.download = 'timetable.png';
            a.href = blob;
        }
    );
    parent_div.insertBefore(a, table_div);
};

const MutationObserverConfig = { attributes: true, childList: true, subtree: true };

chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "timetable_view_page") {
        try {
            // auto fetch the details of the current semester 
            chooseCurrentSemester();
            const timeTableDiv = document.getElementById("loadMyFragment");
            const timeTableDivObserver = new MutationObserver((mutationsList, observer) => change_time_table());
            timeTableDivObserver.observe(timeTableDiv, MutationObserverConfig);
        } catch (error) {
            // console.log(error);
            console.error(error)
        }
    }
});