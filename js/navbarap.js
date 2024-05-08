const nav_bar_change = () => {
	let items_list = Array.from(document.getElementsByTagName("a")).filter(
		(e) => e.dataset.url
	);
	let marks, attendance, course_page, da_upload, time_table, calendar;
	for (let i = 0; i < items_list.length; i++) {
		item = items_list[i].innerText.trim();
		if (item.includes("Class Attendance")) {
			attendance = i;
		} else if (item.includes("Course Page")) {
			course_page = i;
		} else if (item.includes("Digital Assignment Upload")) {
			da_upload = i;
		} else if (item.includes("Time Table")) {
			time_table = i;
		} else if (item.includes("Calendar")) {
			calendar = i;
		} else if (item.includes("Marks")) {
			marks = i;
		}
    else if (item.includes("My Curriculum")) {
      curriculum = i;}

	}
	// console.log(marks, attendance, course_page, da_upload, time_table, calendar);
	let nav = document.getElementsByClassName("collapse navbar-collapse");
	let span = document.createElement("div");
	span.id = "navbar";
	span.innerHTML = `
    <span class="navbar-text px-0 px-sm-2 mx-0 mx-sm-1 text-light" ></span>

    <button class="btn btn-primary border-primary shadow-none" type="button" style="background: rgba(13,110,253,0);border-style: none;" onclick="Array.from(document.getElementsByTagName('a')).filter((e) => e.dataset.url)[${curriculum}].click();" id="nav_short">Curriculum</button>

    <button class="btn btn-primary border-primary shadow-none" type="button" style="background: rgba(13,110,253,0);border-style: none;" onclick="Array.from(document.getElementsByTagName('a')).filter((e) => e.dataset.url)[${marks}].click();" id="nav_short">Marks View</button>

    <button class="btn btn-primary border-primary shadow-none" type="button" style="background: rgba(13,110,253,0);border-style: none;" onclick="Array.from(document.getElementsByTagName('a')).filter((e) => e.dataset.url)[${attendance}].click()" id="nav_short">Attendance</button>

    <button class="btn btn-primary border-primary shadow-none" type="button" style="background: rgba(13,110,253,0);border-style: none;" onclick="Array.from(document.getElementsByTagName('a')).filter((e) => e.dataset.url)[${course_page}].click()" id="nav_short">Course Page</button>

    <button class="btn btn-primary border-primary shadow-none" type="button" style="background: rgba(13,110,253,0);border-style: none;" onclick="Array.from(document.getElementsByTagName('a')).filter((e) => e.dataset.url)[${da_upload}].click()" id="nav_short">DA Upload</button>

    `;
	if (time_table)
		span.innerHTML += `<button class="btn btn-primary border-primary shadow-none" type="button" style="background: rgba(13,110,253,0);border-style: none;" onclick="Array.from(document.getElementsByTagName('a')).filter((e) => e.dataset.url)[${time_table}].click()" id="nav_short">Time Table</button>`;
	else
		span.innerHTML += `<button class="btn btn-primary border-primary shadow-none" type="button" style="background: rgba(13,110,253,0);border-style: none;" onclick="Array.from(document.getElementsByTagName('a')).filter((e) => e.dataset.url)[${time_table}].click()" id="nav_short">Calendar</button>`;
	nav[0].insertBefore(span, nav[0].children[0]);

	let buttons = document.querySelectorAll("[id=nav_short]");
	buttons.forEach((button) => {
		button.addEventListener("click", () => {
			buttons.forEach((but) => {
				but.disabled = true;
				setTimeout(() => {
					buttons.forEach((btn) => {
						btn.disabled = false;
					});
				}, 1500);
			});
		});
	});
};

const clear_navbar = () => {
	document.getElementById("navbar").remove();
};

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
let flag = false;

chrome.runtime.onMessage.addListener((request) => {
	if (request.message === "nav_bar_change") {
		try {
			if (
				document.getElementsByClassName("btn-group dropend")[0].style
					.backgroundColor === "red"
			) {
				document.getElementsByClassName("btn-group dropend")[0].remove();
			}
			if (
				document.getElementsByClassName(
					"btn btn-primary border-primary shadow-none"
				).length == 0 &&
				flag
			) {
				nav_bar_change();
			}
		} catch (error) {
			console.log(error);
		}
	}
});
if (
	document.getElementsByClassName("btn-group dropend")[0]?.style
		.backgroundColor === "red"
) {
	document.getElementsByClassName("btn-group dropend")[0].remove();
}
if (
	document.getElementsByClassName("btn btn-primary border-primary shadow-none")
		.length == 0
) {
	window.addEventListener("load", nav_bar_change, false);
	flag = true;
}

let input = document.createElement("input");