import displayCircleStatusChart from "./circleCharts";
import {
  getStudentStats,
  getDataListByCategory,
  sendDataInfos,
  editStudent,
  getStudentById,
} from "./api";
import displayProfChartsBar from "./barCharts";
import successRegisterStudent from "./registerAnimation";
import { makeListOfTeacherFromDatabase, dataForChartProfs } from "./teachers";
import { drawStudentTemplate, imageChoise } from "./students";
import {
  formUI,
  canvasUI,
  templateUI,
  dashboardUI,
  teacherInputs,
  studentInputs,
} from "./ui";

//const canvasAnimation = document.getElementById("canvas");

let totalMonthRevenu = 0;
let currentStudentId = null;

// this is tha main function if user is in dashboard page
//load this function to display all data
export async function dashboard() {
  // when page load read a the user choice from local storage
  // dispaly all data with the user choice

  const userChoice = localStorage.getItem("choice");
  const studentsArray = await getDataListByCategory(
    "students",
    "category",
    userChoice,
  );
  const teachersArray = await getDataListByCategory(
    "teachers",
    "category",
    userChoice,
  );
  // display number of students in this section
  dashboardUI.totalNumberOfStudents.textContent = `Total of Students : ${studentsArray.results}`;
  const profsData = dataForChartProfs(
    studentsArray.data.filtredStudents,
    teachersArray,
  );
  const labels = Object.keys(profsData);
  const data = Object.values(profsData);
  // get data from paid andn ot paid nad pending and so one
  const studentsStatData = await getStudentStats();
  console.log("a rsaaaaa", studentsStatData);
  displayCircleStatusChart(
    studentsStatData,
    studentsArray.data.filtredStudents,
  );
  displayProfChartsBar(data, labels);
  console.log(teachersArray);
  console.log("hello", studentsArray.data.filtredStudents);
  // display teacher list in the ui select element
  makeListOfTeacherFromDatabase(teachersArray, dashboardUI.profSelector);
  makeListOfTeacherFromDatabase(teachersArray, studentInputs.prof);

  studentsArray.data.filtredStudents.forEach((student) => {
    drawStudentTemplate(student);
    // here we calculate the sum for people how is assigned as paid
    if (student.hasPaid === "oui") {
      totalMonthRevenu += student.price;
    }
  });

  displayDataInDashboard();

  // when sleact a teacher display only student of this target professeur
  dashboardUI.profSelector.addEventListener("change", async (e) => {
    localStorage.setItem("selectedProf", e.target.value);
    const paymentStatu = localStorage.getItem("paymentStatu");
    let selectedStundents = [];
    const urlChunck =
      e.target.value === "all students"
        ? `category=${localStorage.getItem("choice")}`
        : `prof=${e.target.value}`;
    selectedStundents = await getDataListByCategory(
      "students",
      "prof",
      e.target.value,
      true,
      paymentStatu,
      urlChunck,
    );
    //}
    // if have student by teacher we shoudl clear the div container and draw
    //students that are with this teacher
    if (selectedStundents.data.filtredStudents) {
      document.querySelector(".database-students-container").textContent = "";
      selectedStundents.data.filtredStudents.forEach((student) => {
        drawStudentTemplate(student);
      });
    }
  });

  // if user want to search using the search bar
  // we can search by phone number or full name or first or last name
  dashboardUI.searchBarFilter.addEventListener("submit", async (e) => {
    e.preventDefault();

    let userQuery = "";
    const searchValue = document.querySelector(".search-filter").value.trim();
    if (!isNaN(searchValue)) {
      userQuery = "phoneNumber";
    } else {
      userQuery = "fullName";
    }
    const targetSTudent = await getDataListByCategory(
      "",
      userQuery,
      searchValue,
      false,
      "",
      "",
      true,
    );
    document.querySelector(".database-students-container").textContent = "";
    targetSTudent.data.filtredStudents.forEach((student) => {
      drawStudentTemplate(student);
    });
  });

  //
  // if user want to filter by statu like paid not paid late and so one
  dashboardUI.statusSelector.addEventListener("change", async (e) => {
    localStorage.setItem("paymentStatu", e.target.value);
    const prof = localStorage.getItem("selectedProf");
    const urlChunck =
      prof === "all students"
        ? `category=${localStorage.getItem("choice")}`
        : `prof=${prof}`;
    const students = await getDataListByCategory(
      "students",
      "paymentStatu",
      e.target.value,
      true,
      e.target.value,
      urlChunck,
    );
    document.querySelector(".database-students-container").textContent = "";
    students.data.filtredStudents.forEach((student) => {
      drawStudentTemplate(student);
    });
  });

  //});

  // function display the dashboard data the first row like month revenu
  // ,student per professeur,and so one ...
  function displayDataInDashboard() {
    dashboardUI.totalRevenuValue.textContent = `${totalMonthRevenu.toLocaleString()} DH`;
  }

  // this function is for handle teacher input
  formUI.teacherForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const teacher = {
      firstName: teacherInputs.firstName.value,
      lastName: teacherInputs.lastname.value,
      phoneNumber: teacherInputs.phoneNumber.value,
      subject: teacherInputs.teacherSubject.value,
      category: localStorage.getItem("choice"),
    };

    sendDataInfos(teacher, "teachers");
  });

  // this function for handle the the student input
  formUI.studentForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // check image input
    imageChoise(studentInputs);
    // we calculate next payment date if the student has paid
    const nextDatePayment = nextPayment();

    const student = {
      firstName: studentInputs.firstName.value,
      lastName: studentInputs.lastName.value,
      gender: studentInputs.gender.value,
      phoneNumber: studentInputs.phoneNumber.value,
      address: studentInputs.address.value,
      prof: studentInputs.prof.value,
      price: Number(studentInputs.price.value),
      image: studentInputs.imageInput.value,
      hasPaid: studentInputs.hasPaid.value,
      category: localStorage.getItem("choice"),
      // nextPayment: nextDatePayment,
    };

    successRegisterStudent();
    if (!currentStudentId) {
      student.nextPayment = nextDatePayment;
      sendDataInfos(student, "students");
    } else {
      editStudent(currentStudentId, student);
    }
    //reset
    currentStudentId = null;
  });

  // calculate next payment date for student

  function nextPayment() {
    let nextPayment = "";
    if (studentInputs.hasPaid.value === "oui") {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 30);
      nextPayment = nextDate.toLocaleString("fr-FR", {
        year: "numeric",
        day: "numeric",
        month: "long",
      });
    } else {
      nextPayment = null;
    }

    return nextPayment;
  }

  // this fucntion is for controll the ui forms displayor hide them
  function controlForms(button, cssClass, methode) {
    button.addEventListener("click", () => {
      if (button.classList.contains("cancel-btn")) currentStudentId = null;
      document.querySelector(`.${cssClass}`).classList[methode]("hidden");
    });
  }
  // control the student form
  // hide or display student form according the user button
  controlForms(formUI.closeFormBtn, "overlay", "add");
  controlForms(formUI.openFormBtn, "overlay", "remove");

  // control the teacher form
  // hide or display  teacher form according the user button
  controlForms(formUI.teacherFormCloseBtn, "overlay-teacher", "add");
  controlForms(formUI.teacherFormOpenBtn, "overlay-teacher", "remove");

  dashboardUI.cardsContainer.addEventListener("click", async function (e) {
    if (e.target.closest(".edit-btn")) {
      currentStudentId = e.target.closest(".edit-btn").id;

      const studobj = await getStudentById(currentStudentId);
      const { student } = studobj.data;
      // console.log(student.firstName);
      studentInputs.firstName.value = student.firstName;
      studentInputs.lastName.value = student.lastName;
      studentInputs.gender.value = student.gender;
      studentInputs.phoneNumber.value = student.phoneNumber;
      studentInputs.address.value = student.address;
      studentInputs.prof.value = student.prof;
      studentInputs.price.value = student.price;
      studentInputs.imageInput.value = student.image;
      studentInputs.hasPaid.value = student.hasPaid;
      document.querySelector(".overlay").classList.remove("hidden");
    }
  });
}

//

// this section still need to add if user inputs one of them is empty return
