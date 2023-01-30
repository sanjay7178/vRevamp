
function createTableHead(data) {
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    const td = _create_td_element("Time", "header-block");
    tr.appendChild(td);
    for (let i = 0; i < data.length; i++) {
        const text = data[i];
        const td = _create_td_element(text, "header-block");
        tr.appendChild(td);
    }
    thead.appendChild(tr);
    return thead;
}



function createTr(theoryDataArr, labDataArr) {
    const tr = document.createElement("tr");
    for (let i = 0; i < theoryDataArr.length; i++) {
        const theoryClassText = theoryDataArr[i];
        const labClassText = labDataArr[i];
        const td = create_td(theoryClassText, labClassText);
        tr.appendChild(td);
    }
    return tr;
}


function create_td(theoryClassText, labClassText) {
    const add = (a, b) => a + " / " + b;
    const codeExists = getCourseCode(theoryClassText) != null || getCourseCode(labClassText) != null;
    if (!codeExists) return _create_td_element(add(theoryClassText, labClassText), "empty-block");
    if (theoryClassText.length < labClassText.length)
        return _create_td_element(add(labClassText, theoryClassText), "lab-block")
    return _create_td_element(add(theoryClassText, labClassText), "theory-block")
}

function create_download_link() {
    const a = document.createElement("a");
    a.innerHTML = `<i style="font-size: 24px" class="fa">&#xf019;</i> Download Timetable as PNG`;
    a.className = "download-timetable";
    return a;
}

function _create_td_element(text, className) {
    const _td = document.createElement("td");
    _td.className = className;
    const node = document.createTextNode(text);
    _td.appendChild(node);
    return _td;
}

function getPlaceholder() {
    const para = document.createElement("p");
    const node = document.createTextNode("p");
    para.appendChild(node);
    return para;
}

function getBlockText(b1, b2) {
    if (b1.length == 0 && b2.length == 0) return "";
    if (b1.length == b2.length) return b1;
    if (b1.length > b2.length) return addBlocks(b2, b1);
    return addBlocks(b1, b2);
}

function addBlocks(b1, b2) {
    // check if b1 has only "-" character repeated using regex
    if (b1.match(/^-+$/)) return b2;
    if (b2.match(/^-+$/)) return b1;
    return b1 + " / " + b2;
}