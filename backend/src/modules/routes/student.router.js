const express = require("express");

const studentRouter = express.Router();

const {
  getAuthStudent,
  createStudent,
  findStudent,
} = require("../controllers/student.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// GET AUTHENTICATED STUDENT
studentRouter.get("/student", authMiddleware, getAuthStudent);

// REGISTER
studentRouter.post("/student/register", createStudent);

// LOGIN
studentRouter.post("/student/login", findStudent);

module.exports = studentRouter;
