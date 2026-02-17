const canvasAnimation = document.getElementById("canvas");
const canvasMarkPaidAnimation = document.getElementById("mark-paid-canvas");

export const formUI = {
  studentForm: document.querySelector(".student-form"),
  closeFormBtn: document.querySelector(".cancel-btn"),
  openFormBtn: document.querySelector(".add-student-btn"),
  teacherForm: document.querySelector(".teacher-form"),
  teacherFormCloseBtn: document.querySelector(".teacher-cancel-btn"),
  teacherFormOpenBtn: document.querySelector(".add-teacher-btn"),
};

export const canvasUI = {
  canvasAnimation: canvasAnimation,
  context: canvasAnimation.getContext("2d"),
  canvasMarkPaidAnimation: canvasMarkPaidAnimation,
};
export const templateUI = {
  template: document.getElementById("student-templete"),
  statuContainer: document.querySelector(".payment-statu-tag-container"),
  paymentStatu: document.querySelector(".payment-statu"),
};

export const dashboardUI = {
  totalRevenuValue: document.querySelector(".month-revenu"),
  profSelector: document.querySelector(".prof-selector"),
  statusSelector: document.querySelector(".status-selector"),
  profCharsBarCanvas: document.getElementById("prof-chart"),
  totalNumberOfStudents: document.querySelector(".total-students"),
  paidStatusCanvas: document.getElementById("status-circle-chart"),
  searchBarFilter: document.querySelector(".search-container"),
  cardsContainer: document.querySelector(".database-students-container"),
};

export const teacherInputs = {
  firstName: document.querySelector(".teacher-firstname-input"),
  lastname: document.querySelector(".teacher-lastname-input"),
  phoneNumber: document.querySelector(".teacher-phone-num-input"),
  teacherSubject: document.querySelector(".subject-teacher-choice"),
};

export const studentInputs = {
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
