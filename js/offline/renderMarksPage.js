getMarksPage((htmlDataAsStr) => {
  const marksPageBody = document.getElementById('marks-body');
  if (htmlDataAsStr === null) {
    marksPageBody.innerHTML = `<p class="no-data">No Data Available</p>`;
    return;
  }
  marksPageBody.innerHTML = htmlDataAsStr;
});
