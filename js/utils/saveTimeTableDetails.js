const timeTableKey = "timeTable-V1"

// Util file to set and get the timetable data 
// requires to add storage permission in manifest.json 

// shape of data is as follows 
// header: ["Time", 8:00-9:00", "9:00-10:00", ...]
// data :  [
//  
// {
//   "day": "Tuesday",
//   "Theory": ["StartTime-endTime", "TA1-CSE1005-ETH-G14-CB-ALL", "E1-CSE3015-ETH-323-CB-ALL", "---", "__", "STC2 ", ...]
//   "Lab": ["StartTime-endTime", "L1", "L2", ...]
// } ...
// 
// ]

function saveTimeTable(header, data) {
  const d = {};
  d[timeTableKey] = {
    header,
    data
  };

  console.log(d);
  chrome.storage.sync.set(d, () => {
    if (chrome.runtime.lastError) {
      console.error("Error saving timetable: " + chrome.runtime.lastError.message);
    } else {
      console.log("Timetable saved successfully!");
      getTimeTable((timetable) => {
        console.log(timetable)
      });
    }
  });
}

function getTimeTable(callback) {
  // Retrieve timetable data from Chrome storage
  chrome.storage.sync.get(timeTableKey, function(result) {
    if (chrome.runtime.lastError) {
      console.error("Error retrieving timetable: " + chrome.runtime.lastError.message);
      callback(null); // Notify callback function with null if there's an error
    } else {
      // Extract timetable data from result
      const timetable = result[timeTableKey];
      if (timetable) {
        // If timetable exists, pass it to the callback function
        callback(timetable);
      } else {
        console.log("Timetable not found.");
        callback(null); // Notify callback function if timetable doesn't exist
      }
    }
  });
}
