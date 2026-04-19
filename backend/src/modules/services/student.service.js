const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const {
  findById,
  create,
  findByEmail,
} = require("../repositories/student.repo");

const getAuthStudent = async (id) => {
  const student = await findById(id);
  if (!student) throw new Error("User not authenticated");

  return student;
};

const createStudent = async (salt, studentInfo) => {
  const { name, email, password } = studentInfo;
  const hashedPassword = await bcrypt.hash(password, salt);
  return await create({
    name,
    email,
    password: hashedPassword,
  });
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

module.exports = { getAuthStudent, createStudent, loginStudent };
