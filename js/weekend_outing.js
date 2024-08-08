let weekend_outings = () => {
  var newButton = document.createElement("input");
  newButton.type = "button";
  newButton.className = "btn btn-primary";
  newButton.value = "Show Outing Form";

  newButton.onclick = function () {
    if (localStorage.getItem("savedLink") == null) {
      alert("No Outing Form saved");
    }
    // console.log('working')
    if (document.querySelector("#outingForm")) {
      // alert("Outing Form already exists");
      var savedLinkString = localStorage.getItem("savedLink");
      var parsedHTML = JSON.parse(savedLinkString);
      var newElement = document.createElement("div");
      newElement.innerHTML = parsedHTML;

      var targetDiv = document.querySelector(
        "#main-section > section > div.row > div > div"
      );

      targetDiv.appendChild(newElement);
      addTiming();
      document.querySelector(
        "#outingForm > div:nth-child(10) > div.Table.col-sm-10.col-md-offset-1 > div:nth-child(9) > div:nth-child(1) > output"
      ).innerText += " Enter Format Date-Month-Year";
    } else {
      // document.querySelector("#outingForm").remove() ;
      // console.log('working')

      var savedLinkString = localStorage.getItem("savedLink");
      var parsedHTML = JSON.parse(savedLinkString);
      var newElement = document.createElement("div");
      newElement.innerHTML = parsedHTML;

      var targetDiv = document.querySelector(
        "#main-section > section > div.row > div > div"
      );

      targetDiv.appendChild(newElement);
      addTiming();
      document.querySelector(
        "#outingForm > div:nth-child(10) > div.Table.col-sm-10.col-md-offset-1 > div:nth-child(9) > div:nth-child(1) > output"
      ).innerText += " Enter Format Date-Month-Year";
    }
  };

  var existingButton = document.querySelector(
    "#main-section > section > div.row > div > div > div.box-header.with-border"
  );

  if (typeof submitOutingForm !== "function") {
    var scriptElement = document.createElement("script");
    scriptElement.src = "outing/store.js"; // Replace with the actual path to store.js
    document.body.appendChild(scriptElement);
  }

  if (existingButton) {
    existingButton.appendChild(newButton);
  }
  addTiming();
  var linkElement = document.getElementById("outingForm");
  var linkElementString = JSON.stringify(linkElement.outerHTML);
  localStorage.setItem("savedLink", linkElementString);
};

let addTiming = () => {
  let array = ["9:00 AM- 6:30PM", "9:00 AM- 8:30PM"];
  for (i in array) {
    var timing = document.createElement("option");
    timing.value = array[i];
    timing.innerText = array[i];
    document.querySelector("#outTime").append(timing);
  }
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "weekend_outings") {
    try {
      weekend_outings();
    } catch (error) {
      console.log(error);
    }
  }
});
