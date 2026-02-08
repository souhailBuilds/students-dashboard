const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const { studentRoute } = require("./routes/students");
const { teacherRoute } = require("./routes/teacher");

const app = express();
// this one tell Express: “This folder contains my static
//  files (CSS, JS, images). Serve them automatically.”
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cors());
app.use(cors({ origin: process.env.ORIGIN }));

app.use("/students", studentRoute);
app.use("/teachers", teacherRoute);

app.get("/login", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "views", "login.html"));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.LOGIN_USERNAME &&
    password === process.env.LOGIN_PASSWORD
  ) {
    // if pass and username are correct go to next page
    res.redirect("/choice");
  } else {
    // else resend the page login to user again
    res.status(200).sendFile(path.join(__dirname, "views", "login.html"));
  }
});

app.get("/choice", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "views", "choicePage.html"));
});

app.get("/dashboard", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "views", "dashboard.html"));
});

app.get("/template", (req, res) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, "views", "studentTamplate.html"));
});
module.exports = app;
