const express = require("express");
const teacherRoute = express.Router();
const {
  getTeachersList,
  addNewTeacher,
} = require("./../controllers/teacherController");

teacherRoute.get("/", getTeachersList);

teacherRoute.post("/", addNewTeacher);
module.exports = { teacherRoute };
