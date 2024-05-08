getTimeTable((data) => {
  const tableBody = document.getElementById("tt-body");

  if(data === null){
    const noData = document.createElement("p");    
    noData.className = "no-data";
    noData.innerText = "No Data Available";
    tableBody.appendChild(noData);
    return;
  }
  const headerData = data.header;
  const childrenData = data.data;
  headerData.splice(0, 1); // remove the first element which is just "starttime-endtime[1,4,9,16,25];"
  const table = createTable(headerData, childrenData);

  // remove the children in table Body 
  if (tableBody.lastChild !== null) {
    tableBody.removeChild(tableBody.lastChild)
  }

  // add the table 
  tableBody.appendChild(table);
});
