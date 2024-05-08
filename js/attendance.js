//To Do: Add a caution how the calculator works
let view_attendance_page = () => {
  //Working of the calculator
  let table_line = document.querySelectorAll(".table-responsive")[0]
  table_line.getElementsByTagName("span")[0].outerHTML += "<br><br><p style='color:red;'>*Note: This calculator doesn't calculate the attendace till the end of the sem, It only calculates the attendance to 80%</p>";

  //Footer edited_head
  let color_detail = document.createElement("div");
  color_detail.innerHTML = `
    <p style='color:RGB(34 144 62);'>*Attendance Greater than 75%</p>
    <p style='color:rgb(255, 171, 16);margin-top:-10px;'>*Be catious your Attendance is in between 74.01% to 74.99%</p>
    <p style='color:rgb(238, 75, 43); margin-top:-10px'>*Attendance Less than 75%</p>
    `
  table_line.insertAdjacentElement("afterend", color_detail);

  //Head edit
  var table_head = document.getElementsByTagName("thead");
  var edited_head = table_head[0].innerHTML.split("\n");
  edited_head.splice(19, 0, '<th style="vertical-align: middle; text-align: center; border-right: 1px solid #b2b2b2; padding: 5px;">80% Attendance Alert</th>');
  table_head[0].innerHTML = edited_head.join("");

  //Body Edit
  var body = document.getElementsByTagName("tbody");
  var body_row = body[0].querySelectorAll("tr");
  body_row.forEach((row) => {
    let new_Table_Content = row.innerHTML.split("\n");
    if (new_Table_Content[3] != undefined) {
      let attended_classes = parseFloat(new_Table_Content[23].split(">")[2].slice(0, 3));
      let tot_classes = parseFloat(new_Table_Content[24].split(">")[2].slice(0, 3));
      let course_type = new_Table_Content[8];
      if (attended_classes / tot_classes < 0.80) {
        //To maintain exact 75%
        // let req_classes = Math.ceil((3 * (tot_classes)) - (4 * (attended_classes))); 

        //Calculates the attendace to 74.01% (as vit consider it as 75%)
        let req_classes = Math.ceil(((0.80 * tot_classes) - attended_classes) / 0.2599);

        if (course_type.includes("Lab")) {
          req_classes /= 2;
          req_classes = Math.ceil(req_classes);
          new_Table_Content.splice(29, 0, `<td style="vertical-align: middle; border: 1px solid #b2b2b2; padding: 5px; background: rgb(238, 75, 43,0.7);"><p style="margin: 0px;">${req_classes} lab(s) should be attended</p></td>`);
          row.innerHTML = new_Table_Content.join("");
        } else {
          new_Table_Content.splice(29, 0, `<td style="vertical-align: middle; border: 1px solid #b2b2b2; padding: 5px; background: rgb(238, 75, 43,0.7);"><p style="margin: 0px;">${req_classes} class(es) should be attended</p></td>`);
          row.innerHTML = new_Table_Content.join("");
        }
      }
      else {
        //For Exact 75% attendance
        // let bunk_classes = Math.floor(((4 / 3) * (attended_classes)) - tot_classes);

        //For 74.01% which vit calculates it as 75%
        let bunk_classes = Math.floor((attended_classes - (0.80 * tot_classes)) / 0.80);

        let color = "rgb(170, 255, 0,0.7)";
        if (0.7401 <= (attended_classes / tot_classes) && (attended_classes / tot_classes) <= 0.80) {
          color = "rgb(255, 171, 16)";
        }

        if (course_type.includes("Lab")) {
          bunk_classes /= 2;
          bunk_classes = Math.floor(bunk_classes);
          if (bunk_classes == -1) {
            bunk_classes = 0;
          }
          new_Table_Content.splice(29, 0, `<td style="vertical-align: middle; border: 1px solid #b2b2b2; padding: 5px; background: ${color};"><p style="margin: 0px;">Only ${bunk_classes} lab(s) can be Skipped <br>be Catious</p></td>`);
          row.innerHTML = new_Table_Content.join("");
        }
        else {
          if (bunk_classes == -1) {
            bunk_classes = 0;
          }
          new_Table_Content.splice(29, 0, `<td style="vertical-align: middle; border: 1px solid #b2b2b2; padding: 5px; background: ${color};"><p style="margin: 0px;">Only ${bunk_classes} class(es) can be Skipped <br>be Catious</p></td>`);
          row.innerHTML = new_Table_Content.join("");
        }
      }
    }
  });
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "view_attendance_page") {
    try {
      chooseCurrentSemester();
    } catch (error) {
      console.error(error);
    } finally {
      saveAttendancePage(document.querySelector(".box-body").outerHTML);
    }
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "view_attendance") {
    try {
      view_attendance_page();
    } catch (error) {
      console.error(error);
    } finally {
      saveAttendancePage(document.querySelector(".box-body").outerHTML);
    }
  }
});
