// make a list of teachers in UI selector from the database teachers list
export function makeListOfTeacherFromDatabase(arr, place) {
  arr.forEach((teacher) => {
    const option = document.createElement("option");
    option.value = `${teacher.firstName} ${teacher.lastName}`;
    option.textContent = `${teacher.firstName} ${teacher.lastName}`;
    place.appendChild(option);
  });
}

// function display chart for each teacher number of students
export function dataForChartProfs(studentArray, teacherArray) {
  const totalStudentsPerProf = {};
  // first step we loop over array to make an object on all teacher names
  for (let x = 0; x < teacherArray.length; x++) {
    const fullName = `${teacherArray[x].firstName} ${teacherArray[x].lastName}`;
    totalStudentsPerProf[fullName] = 0;
  }
  // if we found a student that has a teacher name increment by 1
  for (let i = 0; i < studentArray.length; i++) {
    if (totalStudentsPerProf[studentArray[i].prof]) {
      totalStudentsPerProf[studentArray[i].prof] += 1;
    } else {
      totalStudentsPerProf[studentArray[i].prof] = 1;
    }
  }

  return totalStudentsPerProf;
}