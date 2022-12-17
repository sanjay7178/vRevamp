let nav_barcc = () => {
    if(document.URL.match("vtopcc")!=null){
        let span=document.createElement("div");
        span.className="navbar-brand";
        span.style.paddingTop="20px"
        span.innerHTML=`
        <a href="javascript:loadmydiv('examinations/StudentMarkView')" id="EXM0011" class="btnItem" onclick="toggleButtonMenuItem()" style="color: #fafafa;border-style: none;text-decoration: none; margin-left: 15px; font-size:15px" >Marks View</a>
        
        <a href="javascript:loadmydiv('academics/common/StudentAttendance')" id="ACD0042" class="btnItem" onclick="toggleButtonMenuItem()" style="color: #fafafa;border-style: none;text-decoration: none; margin-left: 15px;font-size:15px">Class Attendance</a>
        
        <a href="javascript:loadmydiv('academics/common/StudentCoursePage')" id="ACD0045" class="btnItem" onclick="toggleButtonMenuItem()" style="color: #fafafa;border-style: none;text-decoration: none; margin-left: 15px; font-size:15px">Course Page</a>
        
        <a href="javascript:loadmydiv('examinations/StudentDA')" id="EXM0017" class="btnItem" onclick="toggleButtonMenuItem()" style="color: #fafafa;border-style: none;text-decoration: none; margin-left: 15px; font-size:15px">DA Upload</a>
        
        <a href="javascript:loadmydiv('academics/common/StudentTimeTable')" id="ACD0034" class="btnItem" onclick="toggleButtonMenuItem()" style="color: #fafafa;border-style: none;text-decoration: none; margin-left: 15px; font-size:15px">Time Table</a>
        
        <a href="javascript:loadmydiv('academics/common/CalendarPreview')" id="ACD0128" class="btnItem" onclick="toggleButtonMenuItem()" style="color: #fafafa;border-style: none;text-decoration: none; margin-left: 15px; font-size:15px">Academic Calendar</a>
        `;
        document.getElementsByClassName("navbar-header")[0].insertAdjacentElement("beforeend",span)
    }
}

chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "vtopcc_nav_bar") {
      try {
        // alert("asdjhg")
        nav_barcc();
      } catch (error) {
        // console.log(error);
      }
    }
});