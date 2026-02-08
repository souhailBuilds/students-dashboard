const express = require("express");
const studentRoute = express.Router();
//const { Student } = require("./../models/model");
const {
  addStudent,
  getStudents,
  getStats,
} = require("./../controllers/studentController");

studentRoute.post("/", addStudent);
studentRoute.get("/", getStudents);

studentRoute.get("/stats", getStats);

module.exports = { studentRoute };
