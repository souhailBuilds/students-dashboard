import { DotLottie } from "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm";
const canvasAnimation = document.getElementById("canvas");
const today = new Date();
let totalMonthRevenu = 0;

const formUI = {
  studentForm: document.querySelector(".student-form"),
  closeFormBtn: document.querySelector(".cancel-btn"),
  openFormBtn: document.querySelector(".add-student-btn"),
  teacherForm: document.querySelector(".teacher-form"),
  teacherFormCloseBtn: document.querySelector(".teacher-cancel-btn"),
  teacherFormOpenBtn: document.querySelector(".add-teacher-btn"),
};

const canvasUI = {
  canvasAnimation: canvasAnimation,
  context: canvasAnimation.getContext("2d"),
};
const templateUI = {
  template: document.getElementById("student-templete"),
  statuContainer: document.querySelector(".payment-statu-tag-container"),
  paymentStatu: document.querySelector(".payment-statu"),
};

const dashboardUI = {
  totalRevenuValue: document.querySelector(".month-revenu"),
  profSelector: document.querySelector(".prof-selector"),
  statusSelector: document.querySelector(".status-selector"),
  profCharsBarCanvas: document.getElementById("prof-chart"),
  totalNumberOfStudents: document.querySelector(".total-students"),
  paidStatusCanvas: document.getElementById("status-circle-chart"),
  searchBarFilter: document.querySelector(".search-container"),
};

const teacherInputs = {
  firstName: document.querySelector(".teacher-firstname-input"),
  lastname: document.querySelector(".teacher-lastname-input"),
  phoneNumber: document.querySelector(".teacher-phone-num-input"),
  teacherSubject: document.querySelector(".subject-teacher-choice"),
};

const studentInputs = {
  firstName: document.querySelector(".first-name-input"),
  lastName: document.querySelector(".last-name-input"),
  gender: document.querySelector(".gender-input"),
  phoneNumber: document.querySelector(".phone-number-input"),
  address: document.querySelector(".address-input"),
  prof: document.querySelector(".professeur-input"),
  price: document.querySelector(".price-input"),
  imageInput: document.querySelector(".image-input"),
  hasPaid: document.querySelector(".hasPaid-input"),
};
// make a list of teachers in UI selector from the database teachers list
function makeListOfTeacherFromDatabase(arr, place) {
  arr.forEach((teacher) => {
    const option = document.createElement("option");
    option.value = `${teacher.firstName} ${teacher.lastName}`;
    option.textContent = `${teacher.firstName} ${teacher.lastName}`;
    place.appendChild(option);
  });
}

// display only student of a target professeur
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
  if (selectedStundents) {
    document.querySelector(".database-students-container").textContent = "";
    selectedStundents.forEach((student) => {
      drawStudentTemplate(student);
    });
  }
});

// if user want to search using the search bar

dashboardUI.searchBarFilter.addEventListener("submit", async (e) => {
  e.preventDefault();

  let userQuery = "";
  const searchValue = document.querySelector(".search-filter").value.trim();
  if (!isNaN(searchValue)) {
    userQuery = "phoneNumber";
  } else {
    userQuery = "fullName";
  }
  console.log(userQuery);
  const targetSTudent = await getDataListByCategory(
    "",
    userQuery,
    searchValue,
    false,
    "",
    "",
    true,
  );
  console.log(targetSTudent);
  document.querySelector(".database-students-container").textContent = "";
  targetSTudent.forEach((student) => {
    drawStudentTemplate(student);
  });
});

//
function displayProfChartsBar(data, label) {
  const formattedLabels = label.map((name) => name.split(" "));
  new Chart(dashboardUI.profCharsBarCanvas, {
    type: "bar",
    data: {
      labels: formattedLabels,
      datasets: [
        {
          label: "",
          data: data,
          backgroundColor: "#7c3aed",
          borderColor: "#6d28d9",
          borderWidth: 1,
          barPercentage: 1, // Makes bars thinner (0.1 to 1)
          categoryPercentage: 0.6, // Space between bars (0.1 to 1)
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, // This hides the entire legend box
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 10, // Font size for Y-axis numbers
            },
          },
        },
        x: {
          ticks: {
            font: {
              size: 10, // Font size for X-axis labels
            },
          },
        },
      },
    },
  });
}
//////////////:

function displayCircleStatusChart(arr, studentArr) {
  const labels = Object.keys(arr);
  const data = Object.values(arr);
  const paidPercent = Math.floor((arr.paid * 100) / studentArr.length);
  new Chart(dashboardUI.paidStatusCanvas, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          label: "",
          data: data,
          borderWidth: 0, // Removes the white border around segments
          hoverBorderWidth: 0, // Prevents border from appearing on hover
          hoverOffset: 4,
        },
      ],
    },
    options: {
      // Note: 'options' should be plural
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom", // Moves legend below the chart
          labels: {
            usePointStyle: true, // Changes box to a circle/dot
            pointStyle: "circle", // Explicitly sets the shape to a dot
            padding: 15, // Adds breathing room around labels
            boxWidth: 6, // Sets the width of the dot
            boxHeight: 6, // Sets the height of the dot
            useBorderRadius: true,

            font: {
              size: 13,
            },
          },
        },
        centerText: {
          display: true,
          text: [`${paidPercent}%`, "Paid"], // Change this to your variable or logic
        },
      },
      // Cutout percentage makes the doughnut thinner/thicker
      cutout: "75%",
    },
    plugins: [
      {
        id: "centerText",
        afterDraw: (chart) => {

          const {
            ctx,
            chartArea: { top, bottom, left, right, width, height },
          } = chart;
          const options = chart.config.options.plugins.centerText;

          ctx.save();
          const textArray = options.text;
          const centerX = left + width / 2;
          const centerY = (top + height + 10) / 2;

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // --- LINE 1 (Percentage) ---
          ctx.font = `bold ${(height / 60).toFixed(2)}em sans-serif`;
          ctx.fillStyle = "#fff";
          // To move the lines CLOSER together, decrease these numbers (e.g., -5 and +8)
          // To move the lines FURTHER apart, increase them (e.g., -15 and +20)
          ctx.fillText(textArray[0], centerX, centerY - 10);

          // --- LINE 2 (The word "Paid") ---
          ctx.font = `${(height / 120).toFixed(2)}em sans-serif`;
          ctx.fillStyle = "#888";
          ctx.fillText(textArray[1], centerX, centerY + 12);

          ctx.restore();
        },
      },
    ],
  });
}

//

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
  students.forEach((student) => {
    drawStudentTemplate(student);
  });
});

// function display chart for each teacher number of students
function dataForChartProfs(studentArray, teacherArray) {
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

// when page load read a the user choice from local storage
document.addEventListener("DOMContentLoaded", async () => {
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
  dashboardUI.totalNumberOfStudents.textContent = `Total of Students : ${studentsArray.length}`;
  const profsData = dataForChartProfs(studentsArray, teachersArray);
  const labels = Object.keys(profsData);
  const data = Object.values(profsData);
  // get data from paid andn ot paid nad pending and so one
  const studentsStatData = await getStudentStats();
  displayCircleStatusChart(studentsStatData, studentsArray);
  displayProfChartsBar(data, labels);
  console.log(teachersArray);
  console.log("hello", studentsArray);
  // display teacher list in the ui select element
  makeListOfTeacherFromDatabase(teachersArray, dashboardUI.profSelector);
  makeListOfTeacherFromDatabase(teachersArray, studentInputs.prof);

  if (studentsArray) {
    studentsArray.forEach((student) => {
      drawStudentTemplate(student);
      // here we calculate the sum for people how is assigned as paid
      if (student.hasPaid === "oui") {
        totalMonthRevenu += student.price;
      }
    });
  }

  displayDataInDashboard();
});

// function display the dashboard data the first row like month revenu
// ,student per professeur,and so one ...
function displayDataInDashboard() {
  dashboardUI.totalRevenuValue.textContent = `${totalMonthRevenu.toLocaleString()} DH`;
}

// function that check if user haspaid so we display the next date payment
function paymentCheck(student) {
  if (student.hasPaid === "oui") {
    const nextDatePay = new Date(student.nextPayment);
    return nextDatePay.toLocaleDateString("fr-FR", {
      year: "numeric",
      day: "numeric",
      month: "long",
    });
  } else {
    return "Pas encore payé";
  }
}

// this fucntion is help us to calculate the next payment date that student should pay
function calculateDaysLeft(student) {
  const nextDatePay = new Date(student.nextPayment);
  const dayLeft = Math.round((nextDatePay - today) / (1000 * 60 * 60 * 24));
  return dayLeft;
}
// this function is to draw the template student and display it
function drawStudentTemplate(student) {
  const card = templateUI.template.content.cloneNode(true);
  card.querySelector(".student-name-value").textContent =
    `${student.firstName} ${student.lastName}`;
  card.querySelector(".num-tele-value").textContent = `${student.phoneNumber}`;
  card.querySelector(".professeur-value").textContent = student.prof;
  card.querySelector(".price-value").textContent = `${student.price} Dh`;
  card.querySelector(".nextPayment-value").textContent = paymentCheck(student);
  card.querySelector(".student-image").src = student.image;
  card.querySelector(".adress-value").textContent = student.address;
  if (student.hasPaid === "oui") {
    card
      .querySelector(".payment-statu-tag-container")
      .classList.add("statu-active");
    card.querySelector(".days-left").textContent =
      `${calculateDaysLeft(student)} Jours`;
    const progressBarPercent = Math.round(
      (calculateDaysLeft(student) * 100) / 30,
    );
    card
      .querySelector(".progress-bar")
      .style.setProperty("--width", progressBarPercent);
  } else {
    card
      .querySelector(".payment-statu-tag-container")
      .classList.add("statu-not-active");
    card.querySelector(".payment-deadline").classList.add("hidden");
  }

  document.querySelector(".database-students-container").appendChild(card);
}

// this function is for calling data from the database acccording the
// user choice
async function getDataListByCategory(
  targetPersons,
  query,
  choice,
  combineFilters = false,
  paymentStat,
  urlChunck,
  searchBarFilter = false,
) {
  let url = "";
  if (searchBarFilter) {
    url = `http://127.0.0.1:9000/students?${query}=${choice}`;
  } else if (combineFilters) {
    url = `http://127.0.0.1:9000/students?${urlChunck}&paymentStatu=${paymentStat}`;
  } else {
    url = `http://127.0.0.1:9000/${targetPersons}?${query}=${choice}`;
  }

  try {
    const data = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    const listData = await data.json();
    return listData;
  } catch (error) {
    console.log(error);
  }
}

// get data about how many not paid and how many paid and so one for
// draw the circle data in dashboard
async function getStudentStats() {
  try {
    const data = await fetch("http://127.0.0.1:9000/students/stats", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    const statData = await data.json();
    return statData;
  } catch (error) {
    console.log(error);
  }
}

function imageChoise() {
  // if we user dont upload a photo we should put a provisor image
  if (
    studentInputs.imageInput.value === "" &&
    studentInputs.gender.value === "garcon"
  ) {
    studentInputs.imageInput.value = "images/boy.png";
  } else if (
    studentInputs.imageInput.value === "" &&
    studentInputs.gender.value === "fille"
  ) {
    studentInputs.imageInput.value = "images/girll.png";
  }
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
formUI.studentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // check image input
  imageChoise();
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
    nextPayment: nextDatePayment,
  };

  successRegisterStudent();
  sendDataInfos(student, "students");
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
//if the form if succesfully filled return an animation
function successRegisterStudent() {
  const animation = new DotLottie({
    autoplay: true,
    loop: false,
    canvas: document.getElementById("canvas"),
    src: "/jsonAnimation/success.json",
  });
  //reset and remove hidden from canavas
  canvasUI.context.clearRect(
    0,
    0,
    canvasUI.canvasAnimation.width,
    canvasUI.canvasAnimation.height,
  );
  canvasUI.canvasAnimation.classList.remove("hidden");

  animation.addEventListener("complete", function () {
    document.getElementById("canvas").classList.add("hidden");
  });
}
// we send user data to our server after user has submit his form
async function sendDataInfos(studentObj, parametre) {
  try {
    const dashboardUrl = await fetch(`http://127.0.0.1:9000/${parametre}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(studentObj),
    });

    const data = await dashboardUrl.json();

    return data;
  } catch (err) {
    console.log(err);
  }
}

// this fucntion is for controll the ui forms displayor hide them
function controlForms(button, cssClass, methode) {
  button.addEventListener("click", () => {
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

// this section still need to add if user inputs one of them is empty return

