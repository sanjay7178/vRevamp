function extract_header(tbody_table_children) {
  const tr_1 = tbody_table_children[0];
  const tr_2 = tbody_table_children[1];
  const extracted_tr_1 = extract_tr_data(tr_1);
  const extracted_tr_2 = extract_tr_data(tr_2, true);

  const tdHeader = [];
  for (let i = 0; i < extracted_tr_1.length; i++) {
    const startTime = extracted_tr_1[i];
    const endTime = extracted_tr_2[i];
    const text = startTime + " - " + endTime;
    tdHeader.push(text);
  }
  return tdHeader;
}

function getCourseCode(str) {
  const regex = /([A-Z]{3,4})\d{3}/g;
  const matches = str.match(regex);
  if (matches === null) return null;
  return matches[0];
}

function extract_tbody_data(tbody_table_children) {
  const children_data_arr = [];
  for (let i = 0; i < tbody_table_children.length; i += 2) {
    if (i === 0 || i === 2) continue; // the first two itrs are the headers
    const tr_1 = tbody_table_children[i];
    const tr_2 = tbody_table_children[i + 1];
    const day = tr_1.children[0].innerHTML;
    const class_row_data = extract_tr_data(tr_1);
    const lab_row_data = extract_tr_data(tr_2, true);
    children_data_arr.push({
      day,
      "theory": class_row_data,
      "lab": lab_row_data,
    })
  }
  return children_data_arr;
}


function extract_tr_data(_trHTML, is_lab = false) {
  let trHTML = _trHTML.cloneNode(true)
  const text_arr = [];
  // this is so that the bottom logic won't branched as lab's tr only has 1 header while theory has 2

  if (is_lab) trHTML.insertBefore(getPlaceholder(), trHTML.children[0]) // ["Lab", "L1", ... ] -> ["placeholder", "Lab", "L1", ...]
  // trHTML.children[10].remove(); // remove the lunch td
  for (let i = 0; i < trHTML.children.length; i += 1) { // iterate repeated blocks at once
    if (i === 0) continue; // if headers just pass
    // const block = trHTML.children[i].innerHTML;
    // const block2 = trHTML.children[i + 1].innerHTML;
    // const blockText = getBlockText(block, block2); // add the slot data in ascending order
    text_arr.push(trHTML.children[i].innerHTML)
  }

  return text_arr;
}

function filterRepeatedColumns(tdHeader, childrenDataArr){
  // tdHeader = ['Start - End', '08:00 - 08:50', '09:00 - 09:50', '09:00 - 09:50', '10:00 - 10:50', '10:00 - 10:50', '11:00 - 11:50', '11:00 - 11:50', '12:00 - 12:50', '13:00 - 13:50', 'Lunch - Lunch', '14:00 - 14:50', '14:00 - 14:50', '15:00 - 15:50', '15:00 - 15:50', '16:00 - 16:50', '16:00 - 16:50', '17:00 - 17:50', '18:00 - 18:50', '19:00 - 19:50']
  // children_data_arr = [{day: "Monday", theory: ["TA1-CSE1005-ETH-G14-CB-ALL"], "lab": []}]

  const new_children_data_arr = [];

  for(let dayIdx=0; dayIdx<childrenDataArr.length; dayIdx++){
    const day = childrenDataArr[dayIdx].day;
    const { theory, lab } = childrenDataArr[dayIdx];

    let seen_headers = [];
    let new_theory = [];
    let new_lab = [];
    for(let i=0; i<tdHeader.length; i++){
      let header = tdHeader[i];
      if(seen_headers.includes(header)){
        let ele = new_theory.pop(); ele = addBlocks(ele, theory[i]) ; new_theory.push(ele);
        let ele2 = new_lab.pop(); ele2 = addBlocks(ele2, lab[i]) ; new_lab.push(ele2);
        continue;
      };
      seen_headers.push(header);
      new_theory.push(theory[i]);
      new_lab.push(lab[i]);
    }

    new_children_data_arr.push({
      day: day,
      theory: new_theory,
      lab: new_lab
    })
  }
  
  return new_children_data_arr;
}
