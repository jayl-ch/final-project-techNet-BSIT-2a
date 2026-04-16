const express = require("express");

const studentRouter = express.Router();

const {
  createStudent,
  findStudent,
} = require("../controllers/student.controller");

// REGISTER
studentRouter.post("/student/register", createStudent);

// LOGIN
studentRouter.post("/student/login", findStudent);

module.exports = studentRouter;
