"use strict";

export function login() {
  const loginForm = document.querySelector(".login-form");
  const loginData = { username: "", password: "", test: "test" };

  // we collect the user input from inputs fields we make that so we can later
  // clean the inputs fields from username and password
  document.querySelector(".usernameInput").addEventListener("input", (e) => {
    loginData.username = e.target.value;
  });
  document.querySelector(".passwordInput").addEventListener("input", (e) => {
    loginData.password = e.target.value;
  });
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendLoginData();
  });

  // this function send user input to the server
  // to check user input match admin infos
  async function sendLoginData() {
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = "/choicePage.html";
      } else {
        alert("Wrong Password Try Again Please");
        return;
      }
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      // reset input fields in any way, correct infos or not clear fields
      loginForm.username.value = "";
      loginForm.password.value = "";
    }
  }
}
