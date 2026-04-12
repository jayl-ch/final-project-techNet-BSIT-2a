const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const studentRouter = express.Router();

const {
  createStudent,
  findStudent,
  findStudentById,
  getAllStudents,
} = require("../controllers/student.controller");

// REGISTER
studentRouter.post("/student/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await createStudent({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN
studentRouter.post("/student/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await findStudent(email);

    if (!student)
      return res.status(404).json({ message: "Student not found." });

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// SEARCH BY ID (TESTING PURPOSES)
studentRouter.get("/student/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const student = await findStudentById(id);

    if (!student) res.status(404).json({ message: "Student not found." });
    res.status(200).json({ student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL STUDENTS (TESTING PURPOSES)
studentRouter.get("/students", async (req, res) => {
  try {
    const students = await getAllStudents();
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = studentRouter;
