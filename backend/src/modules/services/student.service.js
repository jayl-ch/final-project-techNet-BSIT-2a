const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const {
  findById,
  create,
  findByEmail,
  updateById,
} = require("../repositories/student.repo");
const {
  createToken,
  findActiveByTokenHash,
  revokeByTokenHash,
  revokeByStudentId,
} = require("../repositories/refresh.token.repo");
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "15m";
const REFRESH_TOKEN_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7);
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const getTokenHash = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const signAccessToken = (studentId) => {
  return jwt.sign({ id: studentId, type: "access" }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
};

const signRefreshToken = (studentId, tokenId) => {
  return jwt.sign(
    { id: studentId, tokenId, type: "refresh" },
    REFRESH_TOKEN_SECRET,
    { expiresIn: `${REFRESH_TOKEN_TTL_DAYS}d` },
  );
};

const issueTokenPair = async (studentId) => {
  const tokenId = crypto.randomUUID();
  const accessToken = signAccessToken(studentId);
  const refreshToken = signRefreshToken(studentId, tokenId);

  await createToken({
    studentId,
    tokenId,
    tokenHash: getTokenHash(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

const toPublicStudent = (student) => {
  if (!student) return null;

  return {
    _id: student._id,
    name: student.name,
    email: student.email,
    createdAt: student.createdAt,
    updatedAt: student.updatedAt,
  };
};

const getAuthStudent = async (id) => {
  const student = await findById(id);
  if (!student) throw new UnauthorizedError("User not authenticated");

  return toPublicStudent(student);
};

const createStudent = async (studentInfo) => {
  const { name, email, password } = studentInfo;
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!normalizedName || !normalizedEmail || !password) {
    throw new BadRequestError("Name, email, and password are required");
  }

  if (password.length < 6) {
    throw new BadRequestError("Password must be at least 6 characters");
  }

  const existingStudent = await findByEmail(normalizedEmail);
  if (existingStudent) throw new ConflictError("Email is already in use");

  const hashedPassword = await bcrypt.hash(password, 10);
  const student = await create({
    name: normalizedName,
    email: normalizedEmail,
    password: hashedPassword,
  });

  return toPublicStudent(student);
};

const updateAuthStudent = async (id, profileInfo) => {
  const student = await findById(id);
  if (!student) throw new UnauthorizedError("User not authenticated");

  const { name, email, currentPassword, newPassword } = profileInfo;
  const normalizedName = typeof name === "string" ? name.trim() : undefined;
  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : undefined;

  const updates = {};

  if (normalizedName) {
    updates.name = normalizedName;
  }

  if (normalizedEmail && normalizedEmail !== student.email) {
    const existingStudent = await findByEmail(normalizedEmail);
    if (existingStudent && String(existingStudent._id) !== String(id)) {
      throw new ConflictError("Email is already in use");
    }

    updates.email = normalizedEmail;
  }

  if (typeof newPassword === "string" && newPassword.length > 0) {
    if (!currentPassword) {
      throw new BadRequestError("Current password is required to change password");
    }

    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      throw new BadRequestError("Current password is incorrect");
    }

    if (newPassword.length < 6) {
      throw new BadRequestError("New password must be at least 6 characters");
    }

    updates.password = await bcrypt.hash(newPassword, 10);
  }

  if (!Object.keys(updates).length) {
    throw new BadRequestError("No profile fields provided for update");
  }

  const updatedStudent = await updateById(id, updates);
  return toPublicStudent(updatedStudent);
};

const loginStudent = async ({ email, password }) => {
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!normalizedEmail || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const student = await findByEmail(normalizedEmail);

  if (!student) throw new UnauthorizedError("Invalid credentials");

  const isMatch = await bcrypt.compare(password, student.password);

  if (!isMatch) throw new UnauthorizedError("Invalid credentials");

  return await issueTokenPair(student._id);
};

const loginStudentWithGoogle = async ({ idToken }) => {
  if (!idToken || typeof idToken !== "string") {
    throw new BadRequestError("Google ID token is required");
  }

  if (!GOOGLE_CLIENT_ID) {
    throw new BadRequestError("Google sign-in is not configured on the server");
  }

  let ticket;
  try {
    ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
  } catch (error) {
    throw new UnauthorizedError("Invalid Google ID token");
  }

  const payload = ticket.getPayload();
  const email = typeof payload?.email === "string" ? payload.email.trim().toLowerCase() : "";
  const name = typeof payload?.name === "string" ? payload.name.trim() : "";
  const emailVerified = Boolean(payload?.email_verified);

  if (!emailVerified || !email) {
    throw new UnauthorizedError("Google account email is not verified");
  }

  let student = await findByEmail(email);

  if (!student) {
    const generatedPassword = await bcrypt.hash(crypto.randomUUID(), 10);
    student = await create({
      name: name || email.split("@")[0],
      email,
      password: generatedPassword,
    });
  }

  return await issueTokenPair(student._id);
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new UnauthorizedError("Refresh token is required");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }

  if (decoded?.type !== "refresh" || !decoded?.tokenId) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  const tokenHash = getTokenHash(refreshToken);
  const tokenRecord = await findActiveByTokenHash(tokenHash);

  if (!tokenRecord) {
    throw new UnauthorizedError("Refresh token is no longer valid");
  }

  if (tokenRecord.expiresAt <= new Date()) {
    await revokeByTokenHash(tokenHash);
    throw new UnauthorizedError("Refresh token has expired");
  }

  await revokeByTokenHash(tokenHash);

  return await issueTokenPair(decoded.id);
};

const logoutStudent = async (refreshToken) => {
  if (!refreshToken) {
    throw new BadRequestError("Refresh token is required");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }

  await revokeByTokenHash(getTokenHash(refreshToken));

  if (decoded?.id) {
    await revokeByStudentId(decoded.id);
  }

  return { success: true };
};

module.exports = {
  getAuthStudent,
  updateAuthStudent,
  createStudent,
  loginStudent,
  loginStudentWithGoogle,
  refreshAccessToken,
  logoutStudent,
};
