const studentService = require("../services/student.service");
const asyncHandler = require("../middlewares/async.handler");

const ACCESS_COOKIE_NAME = "taskwise_access_token";
const REFRESH_COOKIE_NAME = "taskwise_refresh_token";
const ACCESS_COOKIE_MAX_AGE = Number(process.env.ACCESS_COOKIE_MAX_AGE_MS || 15 * 60 * 1000);
const REFRESH_COOKIE_MAX_AGE = Number(
  process.env.REFRESH_COOKIE_MAX_AGE_MS || 7 * 24 * 60 * 60 * 1000,
);

const isProduction = process.env.NODE_ENV === "production";

const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge,
});

const writeAuthCookies = (res, tokens) => {
  res.cookie(
    ACCESS_COOKIE_NAME,
    tokens.accessToken,
    getCookieOptions(ACCESS_COOKIE_MAX_AGE),
  );
  res.cookie(
    REFRESH_COOKIE_NAME,
    tokens.refreshToken,
    getCookieOptions(REFRESH_COOKIE_MAX_AGE),
  );
};

const clearAuthCookies = (res) => {
  res.clearCookie(ACCESS_COOKIE_NAME, getCookieOptions(0));
  res.clearCookie(REFRESH_COOKIE_NAME, getCookieOptions(0));
};

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
  writeAuthCookies(res, tokens);
  res.status(200).json({
    token: "cookie-session",
    accessToken: undefined,
    refreshToken: undefined,
    message: "Login successful",
  });
});

const refreshSession = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.taskwise_refresh_token || req.body?.refreshToken;
  const tokens = await studentService.refreshAccessToken(refreshToken);
  writeAuthCookies(res, tokens);

  res.status(200).json({
    token: "cookie-session",
    accessToken: undefined,
    refreshToken: undefined,
    message: "Session refreshed",
  });
});

const logoutStudent = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.taskwise_refresh_token || req.body?.refreshToken;
  await studentService.logoutStudent(refreshToken);
  clearAuthCookies(res);

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
