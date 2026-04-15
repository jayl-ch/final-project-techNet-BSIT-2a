const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { create, findByEmail } = require("../repositories/student.repo");

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

  if (!student) return res.status(404).json({ message: "Student not found." });

  const isMatch = await bcrypt.compare(password, student.password);

  if (!isMatch)
    return res.status(401).json({ message: "Invalid credentials." });

  return jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = { createStudent, loginStudent };
