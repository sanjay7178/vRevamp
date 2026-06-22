function storeCreditsArrays(semester, courseCodes, credits, callback) {
  if (!semester || !courseCodes || !credits) {
    if (callback) callback();
    return;
  }

  getData("creditsBySemester", (existingData) => {
    const allCredits = existingData || {};

    allCredits[semester] = {
      courseCodes,
      credits
    };

    saveData("creditsBySemester", allCredits, () => {
      console.log("Credits stored for semester:", semester);
      if (callback) callback();
    });
  });
}
