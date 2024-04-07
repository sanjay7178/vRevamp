getMarksPage((htmlDataAsStr) => {
  const marksPageBody = document.getElementById('marks-body');
  if (htmlDataAsStr === null) {
    const noData = document.createElement('p');
    noData.className = 'no-data';
    noData.innerText = 'No Data Available';
    marksPageBody.appendChild(noData);
    return;
  }
  marksPageBody.innerHTML = htmlDataAsStr;
});
