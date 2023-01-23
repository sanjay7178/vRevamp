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
    trHTML.children[10].remove(); // remove the lunch td
    for (let i = 0; i < trHTML.children.length; i+=2) { // iterate repeated blocks at once
        if (i === 0) continue; // if headers just pass
        const block = trHTML.children[i].innerHTML;
        const block2 = trHTML.children[i + 1].innerHTML;
        const blockText = getBlockText(block, block2); // add the slot data in ascending order
        text_arr.push(blockText)
    }

    return text_arr;
}