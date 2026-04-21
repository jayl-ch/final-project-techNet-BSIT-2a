const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const {
  findById,
  create,
  findByEmail,
  updateById,
} = require("../repositories/student.repo");

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
  if (!student) throw new Error("User not authenticated");

  return toPublicStudent(student);
};

const createStudent = async (salt, studentInfo) => {
  const { name, email, password } = studentInfo;

  const existingStudent = await findByEmail(email);
  if (existingStudent) throw new Error("Email is already in use");

  const hashedPassword = await bcrypt.hash(password, salt);
  const student = await create({
    name,
    email,
    password: hashedPassword,
  });

  return toPublicStudent(student);
};

const updateAuthStudent = async (id, profileInfo) => {
  const student = await findById(id);
  if (!student) throw new Error("User not authenticated");

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
      throw new Error("Email is already in use");
    }

    updates.email = normalizedEmail;
  }

  if (typeof newPassword === "string" && newPassword.length > 0) {
    if (!currentPassword) {
      throw new Error("Current password is required to change password");
    }

    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }

    if (newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters");
    }

    updates.password = await bcrypt.hash(newPassword, 10);
  }

  if (!Object.keys(updates).length) {
    throw new Error("No profile fields provided for update");
  }

  const updatedStudent = await updateById(id, updates);
  return toPublicStudent(updatedStudent);
};

const loginStudent = async ({ email, password }) => {
  const student = await findByEmail(email);

  if (!student) throw new Error("Student not found");

  const isMatch = await bcrypt.compare(password, student.password);

  if (!isMatch) throw new Error("Invalid credentials");

  return jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = {
  getAuthStudent,
  updateAuthStudent,
  createStudent,
  loginStudent,
};
