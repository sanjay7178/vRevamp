let course = "";
let faculty_slot = "";
let file_name = {};
let time_last = new Date();
let det_file_name = "table_name";

const VTOP_URLS = [
  "*://vtop.vit.ac.in/*",
  "*://vtopcc.vit.ac.in/vtop/*",
  "*://vtop.vitap.ac.in/vtop/*",
  "*://vtop.vitap.ac.in/*",
];

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
      title =
        index + title.split(".")[0] + "-" + file_prefix[7] + file_extension;
    } else {
      title = file_prefix + file_extension;
    }
    // console.log(title);
    return title;
  } else if (det_file_name === "fac_upload_name") {
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
      suggest({
        filename:
          "VIT Downloads/" +
          course.replace(":", "") +
          "/" +
          faculty_slot +
          "/" +
          title,
      });
    else suggest({ filename: "VIT Downloads/Other Downloads/" + title });
  }
});

/* Fires after the completion of a request */
chrome.webRequest.onCompleted.addListener(
  async (details) => {
    let link = details["url"];
    // console.log(link);
    // alert(link.index);
    time_last = new Date();
    set_time_last(time_last);
    returnMessage("showOfflineIcon");
    if (link.indexOf("doStudentMarkView") !== -1) {
      // console.log("mark_view");
      returnMessage("mark_view_page");
    } else if (link.indexOf("StudentTimeTable") !== -1) {
      // console.log("timetable_view_page");
      returnMessage("timetable_view_page");
    } else if (
      link.indexOf("processViewStudentAttendance") !== -1 ||
      link.indexOf("processBackAttendanceDetails") !== -1
    ) {
      returnMessage("view_attendance");
    } else if (link.indexOf("StudentAttendance") !== -1) {
      returnMessage("view_attendance_page");
    } else if (link.indexOf("processViewStudentCourseDetail") !== -1) {
      returnMessage("course_page_change");
    } else if (link.indexOf("doDigitalAssignment") !== -1) {
      returnMessage("da_upload");
    } else if (link.indexOf("vtopcc.vit.ac.in/vtop/vtopLogin") !== -1) {
      returnMessage("vtopcc_captcha");
    } else if (link.indexOf("vtop.vitap.ac.in/vtop/vtopLogin") !== -1) {
      returnMessage("vtop2_captcha");
    } else if (link.indexOf("hrms/employeeSearchForStudent") !== -1) {
      returnMessage("employee_search");
    } else if (link.indexOf("hostel/StudentWeekendOuting") !== -1) {
      returnMessage("weekend_outings");
    } else if (
      link.indexOf("vtop/doLogin") !== -1 ||
      link.indexOf("assets/img/favicon.png") !== -1 ||
      link.indexOf("goHomePage") !== -1
    ) {
      // returnMessage("vtopcc_nav_bar");
      returnMessage("vtop2_nav_bar");
    } else if (link.indexOf("doSearchExamScheduleForStudent") !== -1) {
      returnMessage("exam_schedule");
    } else if (link.indexOf("examGradeView/doStudentGradeView") != -1) {
      // console.log("Exam Grade");
      returnMessage("exam_grade");
    } else if (link.indexOf("menu.js") !== -1 || link.indexOf("home") !== -1) {
      if (link.indexOf("menu.js") !== -1) {
        // sleep function not defined, use setTimeout instead
        await new Promise(resolve => setTimeout(resolve, 3500));
      }
      console.log("nav_bar_change");
      returnMessage("nav_bar_change");
    } else if (link.indexOf("examGradeView/getGradeViewDetail") != -1) {
      // console.log("Exam Grade");
      returnMessage("exam_grade");
    }
  },
  {
    urls: VTOP_URLS,
  }
);

//Fires the msg from script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (request.message.course !== "") trigger_download(request);
  } catch {
    if (request.message == "login") {
      chrome.identity.getAuthToken({ interactive: true }, (auth_token) => {
        chrome.storage.sync.set({ token: auth_token });
        // console.log(auth_token);
        sendResponse(true);
        return true;
      });
    } else if (request.message === "logout") {
      user_signed_in = false;
      chrome.identity.clearAllCachedAuthTokens(() => {
        chrome.storage.sync.set({ token: null });
      });
    }
  }
});

//Removes the inactivity of service worker
chrome.alarms.create({ periodInMinutes: 0.5 });
chrome.alarms.onAlarm.addListener(() => {
  let a;
  let time_nw = new Date();
});

/*
 * Checks if the user is online or offline
 * and renders an offline view for the page
 */

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const isOnline = navigator.onLine;
    if (isOnline) return;
    if (!isOnline) {
      viewOfflinePage();
    }
  },
  { urls: VTOP_URLS }
);

function viewOfflinePage() {
  chrome.tabs.create({ url: chrome.runtime.getURL("html/offline.html") });
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "showOfflinePage") {
    viewOfflinePage();
  }
});

// Fetch credits for a semester in Background

let pendingCreditFetch = {};
function fetchCreditsForSemester(semesterId, gradeTabId) {
  console.log(`called fetch credits with sem id: ${semesterId}`);

  // Prevent duplicate fetch
  if (pendingCreditFetch[semesterId]) {
    console.log("Already fetching credits for semester:", semesterId, ", skipping");
    return;
  }

  const timetableUrl = "https://vtop.vitap.ac.in/vtop/content?";

  // Open hidden popup window
  chrome.windows.create(
    {
      url: timetableUrl,
      focused: false,
      type: "popup",
      width: 1,
      height: 1,
      left: -10000,
      top: -10000
    },(win) => {
      const tab = win.tabs[0];

      console.log(`timetableTabId: ${tab.id}, gradeTabId: ${gradeTabId}`);

      // This prevents hidden windows from staying open if extraction fails
      const cleanupTimeout = setTimeout(() => {
        if (pendingCreditFetch[semesterId]) {
          console.warn(`Credits fetch timeout for semester ${semesterId}, closing window`);
          chrome.windows.remove(win.id);
          delete pendingCreditFetch[semesterId];
        }
      }, 30000);

      pendingCreditFetch[semesterId] = {
        timetableTabId: tab.id,
        gradeTabId,
        windowId: win.id,
        timeoutId: cleanupTimeout  // Store timeout ID to cancel if extraction succeeds
      };

      // Wait for tab load
      const listener = (tabId, info) => {
        if (tabId === tab.id && info.status === "complete") {
          console.log("Timetable tab fully loaded");

          chrome.tabs.onUpdated.removeListener(listener);

          chrome.tabs.sendMessage(tab.id, {
            message: "open_timetable_and_select_semester",
            semesterId
          });
        }
      };

      chrome.tabs.onUpdated.addListener(listener);
    }
  );
}

// Message listeners
chrome.runtime.onMessage.addListener((request, sender) => {

  // Request from grades page
  if (request.message === "fetch_credits_for_semester") {
    console.log("received fetch credits msg");
    console.log("Semester:", request.semesterId);

    fetchCreditsForSemester(request.semesterId, sender.tab.id);
  }

  // Response from timetable page
  else if (request.message === "credits_stored") {
    console.log("background.js: Received 'credits_stored' message");
    console.log("background.js: Full request object:", JSON.stringify(request));
    
    let semesterId = request.semester || request.semesterId;
    console.log("background.js: Semester from message:", semesterId);
    
    let entry = pendingCreditFetch[semesterId];
    let foundSemesterId = semesterId;
    
    if (!entry) {
      console.log("background.js: No entry found for semester:", semesterId, "- searching all entries");
      
      const pendingEntries = Object.entries(pendingCreditFetch);
      console.log("background.js: Total pending entries:", pendingEntries.length);
      
      if (pendingEntries.length === 1) {
        const [foundKey, foundEntry] = pendingEntries[0];
        console.log("background.js: Using single pending entry for semester:", foundKey);
        entry = foundEntry;
        foundSemesterId = foundKey;
      } else if (pendingEntries.length > 1) {
        console.log("background.js: Multiple pending entries, cannot determine which one");
        const [foundKey, foundEntry] = pendingEntries[0];
        console.log("background.js: Using first pending entry for semester:", foundKey);
        entry = foundEntry;
        foundSemesterId = foundKey;
      }
    }
    
    console.log("background.js: Entry found in pendingCreditFetch:", entry);
    
    if (!entry) {
      console.log("background.js: ERROR - No entry found for any semester");
      console.log("background.js: Current pendingCreditFetch:", pendingCreditFetch);
      return;
    }

    console.log("background.js: Credits stored for semester:", foundSemesterId);
    console.log("background.js: Pending fetch before deletion:", pendingCreditFetch[foundSemesterId]);


    // This prevents the timeout from firing after window is already closed
    if (entry.timeoutId) {
      console.log("background.js: Canceling cleanup timeout");
      clearTimeout(entry.timeoutId);
    }

    // No waiting for 30 seconds, close as soon as extraction completes
    console.log("background.js: Closing hidden window with ID:", entry.windowId);
    chrome.windows.remove(entry.windowId, () => {
      console.log("background.js: Window closed successfully for semester:", foundSemesterId);
    });

    console.log("background.js: Sending 'credits_ready' message to grades page (tab ID:", entry.gradeTabId, ")");
    chrome.tabs.sendMessage(entry.gradeTabId, {
      message: "credits_ready",
      semesterId: foundSemesterId
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.log("background.js: Failed to send credits_ready message:", chrome.runtime.lastError.message);
      } else {
        console.log("background.js: Successfully sent credits_ready message");
      }
    });

    delete pendingCreditFetch[foundSemesterId];
    console.log("background.js: Cleaned up pendingCreditFetch entry for:", foundSemesterId);
  }

  else if (request.message === "credits_failed") {
    // Find which entry failed (search by all pending entries)
    let failedEntry = null;
    let failedSemesterId = null;

    for (const semesterId in pendingCreditFetch) {
      if (pendingCreditFetch[semesterId].timetableTabId === sender.tab.id) {
        failedEntry = pendingCreditFetch[semesterId];
        failedSemesterId = semesterId;
        break;
      }
    }

    if (!failedEntry) {
      console.log("Failed entry not found for semester");
      return;
    }

    console.log("Credits extraction failed for:", failedSemesterId);
    console.log("Reason:", request.reason);

    if (failedEntry.timeoutId) {
      clearTimeout(failedEntry.timeoutId);
    }

    // No waiting for 30 seconds, close as soon as failure is detected
    chrome.windows.remove(failedEntry.windowId);

    chrome.tabs.sendMessage(failedEntry.gradeTabId, {
      message: "credits_fetch_failed",
      semesterId: failedSemesterId,
      reason: request.reason
    });

    delete pendingCreditFetch[failedSemesterId];
  }
});
