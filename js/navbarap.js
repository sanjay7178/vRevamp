

let nav_barap = () => {
  if (document.URL.match("vtop2") != null) {
    let newNavDiv = document.createElement("div");
    // div.className = "navbar-brand";
    newNavDiv.classList.add("nav-custom-div");

    newNavDiv.innerHTML = `
        <a href="javascript:loadmydiv('examinations/StudentMarkView')" id="EXM0011" class="btnItem">Marks View</a>
        <a href="javascript:loadmydiv('academics/common/StudentAttendance')" id="ACD0042" class="btnItem"  >Class Attendance</a>
        <a href="javascript:loadmydiv('academics/common/StudentCoursePage')" id="ACD0045" class="btnItem"  >Course Page</a>
        <a href="javascript:loadmydiv('examinations/StudentDA')" id="EXM0017" class="btnItem"  >DA Upload</a>
        <a href="javascript:loadmydiv('academics/common/StudentTimeTable')" id="ACD0034" class="btnItem"  >Time Table</a>
        <a href="javascript:loadmydiv('academics/common/CalendarPreview')" id="ACD0128" class="btnItem"  >Academic Calendar</a>
        <a href="javascript:loadmydiv('academics/common/Curriculum')" id="ACD0104" class="btnItem"  >My Curriculum</a>
        `;
    
    const menuToggleHamburger = document.getElementById("menu-toggle");
    // menuToggleHamburger.className = ""; // remove all classes of menuToggleHamburger
    const navbar = document.getElementsByClassName("navbar navbar-default navbar-fixed-top VTopHeader")[0];
    navbar.innerHTML = ""; 
    newNavDiv.insertBefore(menuToggleHamburger, newNavDiv.firstChild);
    navbar.appendChild(newNavDiv);
    // document.getElementsByClassName("navbar-header")[0].insertAdjacentElement("beforeend", div)
  }
}


chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "vtop2_nav_bar") {
    try {
      // alert("asdjhg")
      nav_barap();
    } catch (error) {
      // console.log(error);
    }
  }
});