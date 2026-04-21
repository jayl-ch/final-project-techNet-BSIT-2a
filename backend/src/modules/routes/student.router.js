const express = require("express");

const studentRouter = express.Router();

const {
  getAuthStudent,
  createStudent,
  findStudent,
  updateAuthStudent,
  refreshSession,
  logoutStudent,
} = require("../controllers/student.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const validateRequest = require("../middlewares/validate.middleware");
const {
  validateRegister,
  validateLogin,
  validateRefreshPayload,
  validateProfileUpdate,
} = require("../validators/request.validators");

// GET AUTHENTICATED STUDENT
studentRouter.get("/student", authMiddleware, getAuthStudent);

// UPDATE AUTHENTICATED STUDENT PROFILE
studentRouter.patch(
  "/student",
  authMiddleware,
  validateRequest(validateProfileUpdate),
  updateAuthStudent,
);

// REGISTER
studentRouter.post("/student/register", validateRequest(validateRegister), createStudent);

// LOGIN
studentRouter.post("/student/login", validateRequest(validateLogin), findStudent);

// REFRESH SESSION
studentRouter.post(
  "/student/refresh",
  validateRequest(validateRefreshPayload),
  refreshSession,
);

// LOGOUT
studentRouter.post(
  "/student/logout",
  validateRequest(validateRefreshPayload),
  logoutStudent,
);

module.exports = studentRouter;
