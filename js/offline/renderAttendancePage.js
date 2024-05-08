getAttendancePage((htmlDataAsStr) => {
  const attdBody = document.getElementById('attendance-body');
  if (htmlDataAsStr === null) {
    attdBody.innerHTML = `<p class="no-data">No Data Available</p>`;
    return;
  }
  attdBody.innerHTML = htmlDataAsStr;
});
