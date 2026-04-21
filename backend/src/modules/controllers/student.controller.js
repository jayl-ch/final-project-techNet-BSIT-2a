const studentService = require("../services/student.service");
const asyncHandler = require("../middlewares/async.handler");

const getAuthStudent = asyncHandler(async (req, res) => {
  const { id } = req.student;
  const student = await studentService.getAuthStudent(id);
  res.status(200).json({ student });
});

const updateAuthStudent = asyncHandler(async (req, res) => {
  const { id } = req.student;
  const student = await studentService.updateAuthStudent(id, req.body);
  res.status(200).json({ student });
});

const createStudent = asyncHandler(async (req, res) => {
  const student = await studentService.createStudent(req.body);
  res.status(201).json({ student });
});

const findStudent = asyncHandler(async (req, res) => {
  const tokens = await studentService.loginStudent(req.body);
  res.status(200).json({
    token: tokens.accessToken,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
});

const refreshSession = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await studentService.refreshAccessToken(refreshToken);

  res.status(200).json({
    token: tokens.accessToken,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
});

const logoutStudent = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  await studentService.logoutStudent(refreshToken);

  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = {
  getAuthStudent,
  updateAuthStudent,
  createStudent,
  findStudent,
  refreshSession,
  logoutStudent,
};
