const nav_bar_change = () => {
  let items_list = document.getElementsByClassName('dropdown-item menuFontStyle systemBtnMenu');
  let marks, attendance, course_page, da_upload, time_table, calendar;
  for (let i = 0; i < items_list.length; i++) {
    item = items_list[i].innerText.trim();
    if (item.includes("Class Attendance")) {
      attendance = i;
    }
    else if (item.includes("Course Page")) {
      course_page = i;
    }
    else if (item.includes("Digital Assignment Upload")) {
      da_upload = i;
    }
    else if (item.includes("Time Table")) {
      time_table = i;
    }
    else if (item.includes("Academics Calendar")) {
      calendar = i;
    }
    else if (item.includes("Marks")) {
      marks = i;
      break;
    }
  }
  let nav = document.getElementsByClassName("collapse navbar-collapse");
  let div = document.createElement("div");
  div.innerHTML = `
  <span class="navbar-text px-0 px-sm-2 mx-0 mx-sm-1 text-light" ></span>

  <button class="btn btn-primary border-primary shadow-none" type="button" style="background: rgba(13,110,253,0);border-style: none;" onclick="document.getElementsByClassName('dropdown-item menuFontStyle systemBtnMenu')[${marks}].click()" id="nav_short">Marks View</button>

  <button class="btn btn-primary border-primary shadow-none" type="button" style="background: rgba(13,110,253,0);border-style: none;" onclick="document.getElementsByClassName('dropdown-item menuFontStyle systemBtnMenu')[${attendance}].click()" id="nav_short">Attendance</button>

  <button class="btn btn-primary border-primary shadow-none" type="button" style="background: rgba(13,110,253,0);border-style: none;" onclick="document.getElementsByClassName('dropdown-item menuFontStyle systemBtnMenu')[${course_page}].click()" id="nav_short">Course Page</button>

  <button class="btn btn-primary border-primary shadow-none" type="button" style="background: rgba(13,110,253,0);border-style: none;" onclick="document.getElementsByClassName('dropdown-item menuFontStyle systemBtnMenu')[${da_upload}].click()" id="nav_short">Da Upload</button>

  <button class="btn btn-primary border-primary shadow-none" type="button" style="background: rgba(13,110,253,0);border-style: none;" onclick="document.getElementsByClassName('dropdown-item menuFontStyle systemBtnMenu')[${time_table}].click()" id="nav_short">Time Table</button>

  <button class="btn btn-primary border-primary shadow-none" type="button" style="background: rgba(13,110,253,0);border-style: none;" onclick="document.getElementsByClassName('dropdown-item menuFontStyle systemBtnMenu')[${calendar}].click()" id="nav_short">Calendar</button>
  `;
  nav[0].insertBefore(div, nav[0].children[0]);

  let buttons = document.querySelectorAll("[id=nav_short]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((but) => {
        but.disabled = true;
        setTimeout(() => {
          buttons.forEach((btn) => { btn.disabled = false });
        }, 1500);
      });
    });
  });

}
chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "nav_bar_change") {
    try {
      nav_bar_change();
      // alert("hi");
    } catch (error) {
      // console.log(error);
    }
  }
});