getExamSchedulePage((htmlDataAsStr) => {
  const marksPageBody = document.getElementById('exam-schedule-body');
  if (htmlDataAsStr === null) {
    marksPageBody.innerHTML = `<p class="no-data">No Data Available</p>`;
    return;
  }
  marksPageBody.innerHTML = htmlDataAsStr;
});
