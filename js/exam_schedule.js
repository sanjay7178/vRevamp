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
    chrome.storage.sync.get(["token"], (token) => {
        // console.log(token.token);
        if (token.token != null) {
            for (let i = 0; i < row.length; i++) {
                if (row[i].children[0].className === "panelHead-secondary" && is_venue(i)) {
                    var exam_type = row[i].children[0].innerText;
                    var sync_button = document.createElement("button");
                    sync_button.innerText = ` Sync Your ${exam_type} dates to google `;
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
                    seat_location: []
                }
                while (temp_row[i].children[0].className !== "panelHead-secondary") {
                    exam.course_code.push(temp_row[i].children[1].innerText);
                    exam.course_title.push(temp_row[i].children[2].innerText);
                    exam.exam_date.push(temp_row[i].children[6].innerText);
                    exam.exam_time.push(temp_row[i].children[9].innerText);
                    exam.venue.push(temp_row[i].children[10].innerText);
                    exam.seat_location.push(temp_row[i].children[11].innerText);
                    i++;
                    if (i == row_count) {
                        break;
                    }
                }
                // console.table(exam);
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
                // console.log(start_date_time, end_date_time);
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
                                description: details.course_code[j] + "-" + details.venue[j] + "-" + details.seat_location[j] + "-" + details.exam_time[j],
                                summary: details.venue[j] + "-" + details.seat_location[j] + "-" + details.course_title[j],
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
                let details = get_details(i);
                let wait_txt = document.getElementsByClassName("form-group")[2].children[1].children[0];
                wait_txt.style.textAlign = "center";
                wait_txt.innerText = "Please Wait while the dates get synced!!!";
                for (let j = 0; j < details.course_code.length; j++) {
                    sync_dates(details, j);
                    if (error_code_exam == 401) {
                        alert("Please Re-login with your Google account and refresh the page");
                        chrome.storage.sync.set({ token: null });
                        error_code_exam = 0;
                        break;
                    }
                    if (j == details.course_code.length - 1) {
                        wait_txt.innerText = "";
                        alert("Dates are sucessfully Synced to your calander")
                    }
                    await sleep(500);
                }
            }
        } else {
            let wait_txt = document.getElementsByClassName("form-group")[2].children[1].children[0];
            wait_txt.style.textAlign = "center";
            wait_txt.style.color = "green";
            wait_txt.innerText = "Please Login with the google by clicking on the extension to sync your Exam dates to the calander";
        }
    });
}

chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "exam_schedule") {
        try {
            exam_schedule_sync();
        } catch (error) {
            // console.log(error);
        }
    }
});