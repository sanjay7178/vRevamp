let view_all_faculty = () => {
  let inputSearch = document.querySelector("#searchEmployee");
  // search input changes  
  document.querySelector("#searchEmployee").removeAttribute("onkeyup")
  document.querySelector("#employeeProfileForm").autocomplete = "on";
  
  // Set new button properties
  var newButton = document.createElement("input");
  newButton.type = "button";
  newButton.className = "btn btn-primary";
  newButton.value = "View All Faculties";
  newButton.onclick = function () {
    // Focus on the input field
    var searchEmployeeInput = document.getElementById('searchEmployee');
    searchEmployeeInput.focus();

    searchEmployeeInput.value = "" ;
    document.getElementById("searchEmployee").removeAttribute("data-validation-engine");
  
    document.querySelector("#employeeProfileForm > div > div.form-group > div:nth-child(3) > input").click()
  };

  document.querySelector("#employeeProfileForm > div > div.form-group > div:nth-child(3)").appendChild(newButton)


  
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "employee_search") {
    try {
      view_all_faculty();
    } catch (error) {
      console.log(error);
    }
  }
});
