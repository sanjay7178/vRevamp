let course = "";
let faculty_slot = "";
let file_name = {};
let time_last = new Date();
let det_file_name = "table_name";

const API_KEY = "AIzaSyAXTXcZx8zuDZl2qRdDqzkqi5nEpjDBwWg";

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "table_name") {
    det_file_name = "table_name";
    // console.log("table_name");
  }
  if (request.message === "fac_upload_name") {
    det_file_name = "fac_upload_name";
    // console.log("fac_upload_name");
  }
});



let set_time_last = (time) => {
  // console.log(time);
  time_last = time;
};
/*Sends a message to the content script */
const returnMessage = (MessageToReturn) => {
  chrome.tabs.query({ active: true }, (tab) => {
    let i;
    for (i = 0; i < tab.length; i++) {
      if (tab[i].url.includes("vtop")) {
        break;
      }
    }
    // console.log(i);
    // console.log(tab);

    chrome.tabs.sendMessage(tab[i].id, {
      message: MessageToReturn,
    });
  });
};

//Trigger download from course_page
const trigger_download = (request) => {
  course = request.message.course;
  faculty_slot = request.message.faculty_slot;
  request.message.link_data.forEach((link) => {
    file_name[link.url] = link.title;
    chrome.downloads.download({
      url: link.url,
      conflictAction: "overwrite",
    });
  });
};

//Gives the file name 
const get_file_name = (fname, url) => {
  let title = "";
  let file_extension = fname.replace(/([^_]*_){8}/, "").split(".");
  file_extension = "." + file_extension[file_extension.length - 1];
  // splits after the fifth occurence of '_'
  if (det_file_name === "table_name") {
    let file_prefix = file_name[url] || "";
    // file_prefix = file_prefix.replace(/(\r\n|\n|\r)/gm, " ");
    file_prefix = file_prefix.split("\n")[0];
    if (file_prefix.length < 4) {
      let index = file_name[url] || "";
      index = index.split("-")[0] + "-";
      let file_prefix = fname.split("_");
      // console.log(file_prefix);
      for (let i = 8; i < file_prefix.length; i++) {
        title += file_prefix[i];
        title += " ";
      }
      title = index + title.split(".")[0] + "-" + file_prefix[7] + file_extension;
    }
    else {
      title = file_prefix + file_extension;
    }
    // console.log(title);
    return title;
  }
  else if (det_file_name === "fac_upload_name") {
    let index = file_name[url] || "";
    index = index.split("-")[0] + "-";
    let file_prefix = fname.split("_");
    // console.log(file_prefix);
    for (let i = 8; i < file_prefix.length; i++) {
      title += file_prefix[i];
      title += " ";
    }
    title = index + title.split(".")[0] + "-" + file_prefix[7] + file_extension;
    return title;
  }
};

//Change File Name for the file
chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
  // console.log(item);
  if (item.url.indexOf("vtop") !== -1) {
    const title = get_file_name(item.filename, item.url);
    // console.log(course == "");
    if (course != "" && faculty_slot != "")
      suggest({ filename: "VIT Downloads/" + course.replace(":", "") + "/" + faculty_slot + "/" + title, });
    else
      suggest({ filename: "VIT Downloads/Other Downloads/" + title });
  }
});

/* Fires after the completion of a request */
chrome.webRequest.onCompleted.addListener(
  (details) => {
    let link = details["url"];
    console.log(link);
    time_last = new Date();
    set_time_last(time_last);
    if (link.indexOf("doStudentMarkView") !== -1) {
      returnMessage("mark_view_page");
    }
    else if (link.indexOf("StudentTimeTable") !== -1) {
      returnMessage("timetable_view_page");
    }
    else if (link.indexOf("processViewStudentAttendance") !== -1 || link.indexOf("processBackAttendanceDetails") !== -1) {
      returnMessage("view_attendance");
    }
    else if (link.indexOf("StudentAttendance") !== -1) {
      returnMessage("view_attendance_page");
    }
    else if (link.indexOf("processViewStudentCourseDetail") !== -1) {
      returnMessage("course_page_change");
    }
    else if (link.indexOf("doDigitalAssignment") !== -1) {
      returnMessage("da_upload");
    }
    else if (link.indexOf("vtopcc.vit.ac.in/vtop/vtopLogin") !== -1) {
      returnMessage("vtopcc_captcha");
    }
    else if (link.indexOf("vtop2.vitap.ac.in/vtop/vtopLogin") !== -1) {
      returnMessage("vtop2_captcha");
    }
    else if (link.indexOf("vtop/doLogin") !== -1 || link.indexOf("assets/img/favicon.png") !== -1 || link.indexOf("goHomePage") !== -1) {
      // returnMessage("vtopcc_nav_bar");
      returnMessage("vtop2_nav_bar");

    }
    else if (link.indexOf("doSearchExamScheduleForStudent") !== -1) {
      returnMessage("exam_schedule");
    }
  },
  {
    urls: ["*://vtop.vit.ac.in/*", "*://vtopcc.vit.ac.in/vtop/*","*://vtop2.vitap.ac.in/vtop/*"],
  }
);

//Fires the msg from script 
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (request.message.course !== "")
      trigger_download(request);
  }
  catch {
    if (request.message == "login") {
      chrome.identity.getAuthToken({ interactive: true }, (auth_token) => {
        chrome.storage.sync.set({ token: auth_token });
        // console.log(auth_token);
        sendResponse(true);
        return true;
      });
    }
    else if (request.message === "logout") {
      user_signed_in = false;
      chrome.identity.clearAllCachedAuthTokens(() => { chrome.storage.sync.set({ token: null }); });
    }

  }

});

//Removes the inactivity of service worker
chrome.alarms.create({ periodInMinutes: 0.5 });
chrome.alarms.onAlarm.addListener(() => {
  let a;
  let time_nw = new Date();
});