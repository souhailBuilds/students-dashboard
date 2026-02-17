import displayCircleStatusChart from "./circleCharts";
import {
  getStudentStats,
  getDataListByCategory,
  sendDataInfos,
  editStudent,
  getStudentById,
  deleteStudent,
} from "./api";
import displayProfChartsBar from "./barCharts";
import successRegisterStudent from "./registerAnimation";
import markPaidAniimation from "./markPaidAnimation";
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
let studentsArray = [];
//let teachersArray = [];

// this is tha main function if user is in dashboard page
//load this function to display all data
export async function dashboard() {
  // when page load read a the user choice from local storage
  // dispaly all data with the user choice

  const userChoice = localStorage.getItem("choice");
  studentsArray = await getDataListByCategory(
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
  // get data from paid and not paid nad pending and so one
  const studentsStatData = await getStudentStats();
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
    //student.hasPaid === "oui"
    if (student.hasPaid === true) {
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
      // hasPaid: studentInputs.hasPaid.value,
      category: localStorage.getItem("choice"),
      // nextPayment: nextDatePayment,
    };

    successRegisterStudent();
    // if we have an currentStudentId THAT MEAN WE WANT TO UPDATE
    // A STUDENT
    // ELSE WE WANT TO CRREATE A NEW STUDENT
    if (!currentStudentId) {
      student.nextPayment = nextDatePayment;
      student.hasPaid = studentInputs.hasPaid.value;
      sendDataInfos(student, "students");
    } else {
      editStudent(currentStudentId, student);
    }
    //reset CURRENT STUDENT ID FOR NEXT STEP IF WE need
    // TO CREATE A NEW STUDENT later
    currentStudentId = null;
  });

  // calculate nexPayment for markPaid button using data from database
  function nextPaymentDateFromDatabase(student) {
    let nextPayment = "";
    // if student has already a nexPayment date
    if (student.nextPayment) {
      const nextDate = new Date(student.nextPayment);
      nextDate.setDate(nextDate.getDate() + 30);
      // nextPayment = nextDate.toLocaleString("fr-FR", {
      //   year: "numeric",
      //   day: "numeric",
      //   month: "long",
      // });
      nextPayment = nextDate.toISOString();
    } else {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 30);
      // nextPayment = nextDate.toLocaleString("fr-FR", {
      //   year: "numeric",
      //   day: "numeric",
      //   month: "long",
      // });
      nextPayment = nextDate.toISOString();
    }

    return nextPayment;
  }

  // calculate next payment date for student registration phase
  function nextPayment() {
    let nextPayment = "";
    if (studentInputs.hasPaid.value === "true") {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 30);
      // nextPayment = nextDate.toLocaleString("fr-FR", {
      //   year: "numeric",
      //   day: "numeric",
      //   month: "long",
      // });
      nextPayment = nextDate.toISOString();
    } else {
      nextPayment = null;
    }

    return nextPayment;
  }

  // this fucntion is for controll the ui forms displayor hide them
  function controlForms(button, cssClass, methode) {
    button.addEventListener("click", () => {
      // awalys reste currentStudentid to null we we click cancel button
      if (button.classList.contains("cancel-btn")) currentStudentId = null;
      // if we want to registerSTudent for the first time show payment status select
      if (button.classList.contains("add-student-btn"))
        document.querySelector(".payment-status").classList.remove("hidden");
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
      // studentInputs.hasPaid.classList.add("hidden");
      document.querySelector(".payment-status").classList.add("hidden");
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
    } else if (e.target.classList.contains("mark-paid")) {
      // if the target is button MARK PAID
      // we find the student that have our id and then
      // we check if has a nextPayment date we recalculate from his last payment+30
      // if he dont have any next payment we calculate from today+30
      currentStudentId = e.target.id;
      const studobj = await getStudentById(currentStudentId);
      const { student } = studobj.data;
      const nextDate = nextPaymentDateFromDatabase(student);
      await editStudent(currentStudentId, {
        nextPayment: nextDate,
        hasPaid: true,
      });

      // this part is for DOM manipulation when we user click Mark paid
      // i prefer manipulate dom instead of fetch all students and re display them
      cardDOMmanipulation(e.target, nextDate);
      // here we acctualise the payment statu circle when mark paid
      // was cklicked
      const studentsStatData = await getStudentStats();
      displayCircleStatusChart(
        studentsStatData,
        studentsArray.data.filtredStudents,
      );

      markPaidAniimation();
    } else if (e.target.closest(".delete-btn")) {
      console.log("delete");
      currentStudentId = e.target.closest(".delete-btn").id;
      deleteStudent(currentStudentId);
    }
  });

  function cardDOMmanipulation(e, nextDate) {
    const studentCard = e.closest(".student-card");
    const paymentDeadLineContainer =
      studentCard.querySelector(".payment-deadline");
    //
    const today = new Date();
    const nextDatePay = new Date(nextDate);
    const calc = Math.round((nextDatePay - today) / (1000 * 60 * 60 * 24));
    const percent = (calc * 100) / 30;
    // this for a progress bar div how much left
    const progressBarDiv =
      paymentDeadLineContainer.querySelector(".progress-bar");
    progressBarDiv.style.setProperty("--width", percent);
    paymentDeadLineContainer.classList.remove("hidden");
    //
    // this is a payment infos parent container
    const paymentInfosContainer =
      paymentDeadLineContainer.querySelector(".payment-infos");
    // this a span inside paymentDeadLineContainer that display how much left (countDown)
    const daysCountDown = paymentInfosContainer.querySelector(".days-left");

    daysCountDown.textContent = `${calc} Jours`;
    /// this a div parent of next payment infos div
    const nextPaymentContainer = studentCard.querySelector(
      ".next-payment-container",
    );
    // this is span inside nextPaymentCOntainer that display next date of payment
    const nextPaymentVal =
      nextPaymentContainer.querySelector(".nextPayment-value");
    nextPaymentVal.textContent = new Date(nextDate).toLocaleString("fr-FR", {
      year: "numeric",
      day: "numeric",
      month: "long",
    });

    const priceContainer = studentCard.querySelector(".price-container");
    const priceText = priceContainer.querySelector(".price-value").textContent;
    const price = priceText.split(" ");
    const studentPrice = Number(price[0]);

    // change teh revenu sum after mark paid button clicked
    dashboardUI.totalRevenuValue.textContent = `${(totalMonthRevenu + studentPrice).toLocaleString()} DH`;

    // chnage color of statu from orange to green color
    const activeStatu = studentCard.querySelector(
      ".payment-statu-tag-container",
    );

    activeStatu.classList.remove("statu-not-active");
    activeStatu.classList.add("statu-active");
  }
}

//

// this section still need to add if user inputs one of them is empty return
