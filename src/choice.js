export function choice() {
  const choiceBtn = document.querySelectorAll(".choice-btn");

  choiceBtn.forEach((button) => {
    button.addEventListener("click", () => {
      window.localStorage.setItem("choice", button.value);
      window.location.href = "/dashboard.html";
    });
  });
}
