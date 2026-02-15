import { templateUI } from "./ui";
const today = new Date();
// this function is to draw the template student and display it
export function drawStudentTemplate(student) {
  const card = templateUI.template.content.cloneNode(true);
  card.querySelector(".student-name-value").textContent =
    `${student.firstName} ${student.lastName}`;
  card.querySelector(".num-tele-value").textContent = `${student.phoneNumber}`;
  card.querySelector(".professeur-value").textContent = student.prof;
  card.querySelector(".price-value").textContent = `${student.price} Dh`;
  card.querySelector(".nextPayment-value").textContent = paymentCheck(student);
  card.querySelector(".student-image").src = student.image;
  card.querySelector(".adress-value").textContent = student.address;
  card.querySelector(".edit-btn").setAttribute("id", student._id);
  card.querySelector(".delete-btn").setAttribute("id", student._id);
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

//this fucntion is help us to calculate the next payment date that student should pay
function calculateDaysLeft(student) {
  const nextDatePay = new Date(student.nextPayment);
  const dayLeft = Math.round((nextDatePay - today) / (1000 * 60 * 60 * 24));
  return dayLeft;
}

export function imageChoise(studentInputs) {
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
