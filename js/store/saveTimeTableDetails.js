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

const timeTableKey = "timeTable-V1"

function saveTimeTable(header, data) {
  saveData(timeTableKey, {header, data});
}

function getTimeTable(callback) {
  getData(timeTableKey, callback);
}
