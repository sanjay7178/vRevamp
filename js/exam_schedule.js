let error_code_exam = 0;
let is_venue = (i) => {
    i++;
    let row = document.getElementsByTagName("tbody")[0].rows;
    let empty_venue_count = 0;
    while (row[i].children[0].className !== "panelHead-secondary") {
        // console.log(row[i].children[11].innerText);
        if (row[i].children[11].innerText == "-") {
            empty_venue_count++;
        }
        i++;
        if (i == row.length) {
            break;
        }
    }
    if (empty_venue_count > 2)
        return false;
    else
        return true;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let exam_schedule_sync = () => {
    let row = document.getElementsByTagName("tbody")[0].rows;
    // chrome.storage.sync.get(["token"], (token) => {
        // console.log(token.token);
        // if (token.token != null) {
            for (let i = 0; i < row.length; i++) {
                if (row[i].children[0].className === "panelHead-secondary" && is_venue(i)) {
                    var exam_type = row[i].children[0].innerText;
                    var sync_button = document.createElement("button");
                    sync_button.innerText = ` Download ${exam_type} to .ics Format `;
                    sync_button.id = i;
                    sync_button.className = "btn btn-primary";
                    sync_button.onclick = () => call_sync(i);
                    sync_button.style.marginLeft = "1%";
                    sync_button.style.background = "rgb(73,117,182)";
                    row[i].children[0].appendChild(sync_button)
                }
            }


            let get_details = (i) => {
                i = parseInt(i);
                i++;
                let row_count = document.getElementsByTagName("tbody")[0].rows.length;
                let temp_row = document.getElementsByTagName("tbody")[0].rows;
                let exam = {
                    course_code: [],
                    course_title: [],
                    exam_date: [],
                    exam_time: [],
                    venue: [],
                    venue_room: [],
                    seat_number: [],
                    seat_location: []
                }
                let body = "";
                // console.log(exam.course_code,exam.course_title,exam.end_time)
                header = "BEGIN:VCALENDAR\n"+
                "VERSION:2.0\n"+
                "PRODID:-//ChatGPT//iCal Generator//EN\n"+
                "CALSCALE:GREGORIAN\n\n" ;
                // 15-Feb-2023
                var map = {
                    Jan: "01",
                    Feb: "02",
                    Mar: "03",
                    Apr: "04",
                    May: "05",
                    Jun: "06",
                    Jul: "07",
                    Aug: "08",
                    Sep: "09",
                    Sept: "09",
                    Oct: "10",
                    Nov: "11",
                    Dec: "12",
                };
                while (temp_row[i].children[0].className !== "panelHead-secondary") {
                    exam.course_code.push(temp_row[i].children[1].innerText);
                    exam.course_title.push(temp_row[i].children[2].innerText);
                    exam.exam_date.push(temp_row[i].children[6].innerText);
                    exam.exam_time.push(temp_row[i].children[9].innerText);
                    exam.venue.push(temp_row[i].children[10].innerText);
                    exam.venue_room.push(temp_row[i].children[11].innerText);
                    try {
                    exam.seat_location.push(temp_row[i].children[12].innerHTML);
                        
                    } catch (error) {
                        console.log(error)
                    }
                    exam.seat_number.push(temp_row[i].children[13].innerText);
                    i++;
                    if (i == row_count) {
                        break;
                    }
                }
                i= 0;
                // console.log(row_count)
                // console.log(exam.course_code,exam.course_title,exam.exam_date,exam.exam_time,exam.venue,exam.venue_room, exam.seat_location)
                // console.log(exam)
                while (i < exam.course_code.length) {
                    var tmp = exam.exam_date[i].split("-");
                    // AM or PM 
                    try{if(exam.exam_time[i].split("-")[0].trim().slice(6, 8) == "AM"){
                        var start_time = exam.exam_time[i].split("-")[0].trim().slice(0, 5);
                        var end_time = exam.exam_time[i].split("-")[1].trim().slice(0, 5);}
                    else{
                        var start_time = exam.exam_time[i].split("-")[0].trim().slice(0, 5);
                        var end_time = exam.exam_time[i].split("-")[1].trim().slice(0, 5);
                        
                        start_time = parseInt(start_time.split(":")[0]) + 12 + ":" + start_time.split(":")[1];
                        end_time = parseInt(end_time.split(":")[0]) + 12 + ":" + end_time.split(":")[1];
                    }}catch(error){
                        alert("Please check your exam schedule and try again "+exam.course_code[i]+" "+" has no exam time")
                    }
                    const now = new Date();
                    // Format the date and time as a string in the correct format
                    const year1 = now.getUTCFullYear();
                    const month1 = String(now.getUTCMonth() + 1).padStart(2, '0');
                    const day1 = String(now.getUTCDate()).padStart(2, '0');
                    const hour1 = String(now.getUTCHours()).padStart(2, '0');
                    const minute1 = String(now.getUTCMinutes()).padStart(2, '0');
                    const second1 = String(now.getUTCSeconds()).padStart(2, '0');

                    console.log(start_time,end_time)

                    try{header += "BEGIN:VEVENT\n"+ 
                    "UID:"+ `${year1}${month1}${day1}T${hour1}${minute1}${second1}Z-${exam.course_code[i]}@vitap.ac.in\n`+
                    "DTSTAMP:"+ `${year1}${month1}${day1}T${hour1}${minute1}${second1}Z\n`+
                    "DTSTART:"+ `${tmp[2]}${map[tmp[1]]}${tmp[0]}T`+ `${start_time.split(":")[0]}`+`${start_time.split(":")[1]}00Z\n`+
                    "DTEND:"+ `${tmp[2]}${map[tmp[1]]}${tmp[0]}T`+ `${end_time.split(":")[0]}`+`${end_time.split(":")[1]}00Z\n`+
                    "SUMMARY:"+ exam.course_code[i]+":"+exam.course_title[i]+"\n"+
                    "DESCRIPTION:"+"Seat Location : "+exam.seat_location[i] +";"+ " Seat Number : "+exam.seat_number[i] + "\n"+
                    "LOCATION:"+ exam.venue[i]+" "+exam.venue_room[i]+" " +"\n"+
                    "END:VEVENT\n\n";}
                    catch(error){ header += "\n"}
                    
                    // console.log(i)
                    // exam.course_code.push(temp_row[i].children[1].innerText);
                    // exam.course_title.push(temp_row[i].children[2].innerText);
                    // exam.exam_date.push(temp_row[i].children[6].innerText);
                    // exam.exam_time.push(temp_row[i].children[9].innerText);
                    // exam.venue.push(temp_row[i].children[10].innerText);
                    // exam.venue_room.push(temp_row[i].children[11].innerText);
                    i++;
                    // if (i == row_count) {
                    //     break;
                    // }
                }
                // console.log(document.querySelector("#semesterSubId").options[document.querySelector("#semesterSubId").options.selectedIndex].innerText+" "+".ics");
                footer = "END:VCALENDAR"
                try{ics = header  + footer;        
                // console.log(ics);  
                // download ics as file
                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(ics));
                // file name 
                element.setAttribute('download', `${document.querySelector("#semesterSubId").options[document.querySelector("#semesterSubId").options.selectedIndex].innerText} ${exam_type}.ics`);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);}
                catch(error){
                    console.log(error)
                }
                return exam;

            }

            let get_date_time = (date, time) => {
                let start_date_time, end_date_time;
                start_date_time = time.split("-")[0].trim();
                end_date_time = time.split("-")[1].trim();
                if (start_date_time.slice(-2).toLowerCase() == "pm") {
                    let clk_24 = (parseInt(start_date_time.slice(0, 2)) + 12).toString();
                    if (clk_24 >= 24)
                        clk_24 = "12"
                    start_date_time = date + "T" + clk_24 + start_date_time.slice(2, 5) + ":00.000+05:30";
                } else {
                    start_date_time = date + "T" + start_date_time.slice(0, 5) + ":00.000+05:30";
                }
                if (end_date_time.slice(-2).toLowerCase() == "pm") {
                    let clk_24 = (parseInt(end_date_time.slice(0, 2)) + 12).toString();
                    if (clk_24 >= 24)
                        clk_24 = "12"
                    end_date_time = date + "T" + clk_24 + end_date_time.slice(2, 5) + ":00.000+05:30";
                } else {
                    end_date_time = date + "T" + end_date_time.slice(0, 5) + ":00.000+05:30";
                }
                console.log(start_date_time, end_date_time);
                return [start_date_time, end_date_time];
            }

            let sync_dates = (details, j) => {
                chrome.storage.sync.get(["token"], (token) => {
                    var map = {
                        Jan: "01",
                        Feb: "02",
                        Mar: "03",
                        Apr: "04",
                        May: "05",
                        Jun: "06",
                        Jul: "07",
                        Aug: "08",
                        Sep: "09",
                        Sept: "09",
                        Oct: "10",
                        Nov: "11",
                        Dec: "12",
                    };
                    var tmp = details.exam_date[j].split("-");
                    var dte = `${tmp[2]}-${map[tmp[1]]}-${tmp[0]}`;
                    let [start_time, end_time] = get_date_time(dte, details.exam_time[j]);
                    // console.log(start_time, end_time);
                    fetch(
                        "https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all&sendNotifications=true&alt=json&key=AIzaSyCPBz-DTZdoTLQ_ZiqsVUO520XItcomTn0",
                        {
                            method: "POST",
                            headers: {
                                Authorization: "Bearer " + token.token,
                                Accept: "application/json",
                            },
                            body: JSON.stringify({
                                end: {
                                    dateTime: end_time,
                                },
                                start: {
                                    dateTime: start_time,
                                },
                                eventType: "default",
                                description: details.course_code[j] + "-" + details.venue[j] + "-" + details.venue_room[j] + "-" + details.exam_time[j],
                                summary: details.venue[j] + "-" + details.venue_room[j] + "-" + details.course_title[j],
                            }),
                        }
                    )
                        .then(async (res) => {
                            return res.json();
                        })
                        .then((data) => {
                            // console.log(data);
                            try {
                                if (data.error.code == 401) {
                                    error_code_exam = 401
                                } else if (data.error.code == 403) {
                                    sync_dates(details, j);
                                }
                            } catch { }
                            // return true;
                        })
                        .catch((err) => {
                            // return false;
                        });
                });
            }

            let call_sync = async (i) => {
                // let details = get_details(i);
                // let wait_txt = document.getElementsByClassName("form-group")[2].children[1].children[0];
                // wait_txt.style.textAlign = "center";
                // wait_txt.innerText = "Please Wait while the dates get synced!!!";
                // for (let j = 0; j < details.course_code.length; j++) {
                //     sync_dates(details, j);
                //     if (error_code_exam == 401) {
                //         alert("Please Re-login with your Google account and refresh the page");
                //         chrome.storage.sync.set({ token: null });
                //         error_code_exam = 0;
                //         break;
                //     }
                //     if (j == details.course_code.length - 1) {
                //         wait_txt.innerText = "";
                //         alert("Dates are sucessfully Synced to your calander")
                //     }
                //     await sleep(500);
                // }
                try{
                    let details = get_details(i);
                    if(details.course_code.length == 0){
                        alert("No exams are scheduled");
                        return;
                    }
                    alert("Succesfully downloaded the exam schedule")
                }catch(error){
                    // console.log(error);
                    alert("Refresh the page and try again")
                }
            }
        // } else {
        //     let wait_txt = document.getElementsByClassName("form-group")[2].children[1].children[0];
        //     wait_txt.style.textAlign = "center";
        //     wait_txt.style.color = "green";
        //     wait_txt.innerText = "Please Login with the google by clicking on the extension to sync your Exam dates to the calander";
        // }
    // });
}

chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "exam_schedule") {
        try {
            exam_schedule_sync();
        } catch (error) {
            console.log(error);
        }
    }
});