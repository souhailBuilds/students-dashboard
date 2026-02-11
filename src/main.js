const page = document.body.id;
if (page === "login") {
  import("./login.js").then((res) => {
    res.login();
  });
} else if (page === "choice") {
  import("./choice.js").then((res) => {
    res.choice();
  });
} else if (page === "dashboard") {
  import("./dashboard.js").then((res) => {
    res.dashboard();
  });
}
