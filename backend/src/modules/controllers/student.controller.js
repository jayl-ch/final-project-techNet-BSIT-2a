const studentService = require("../services/student.service");

const getAuthStudent = async (req, res) => {
  const { id } = req.student;
  try {
    const student = await studentService.getAuthStudent(id);
    res.status(200).json({ student });
  } catch (error) {
    if (error.message === "User not authenticated") {
      return res.status(401).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message });
  }
};

const updateAuthStudent = async (req, res) => {
  const { id } = req.student;

  try {
    const student = await studentService.updateAuthStudent(id, req.body);
    res.status(200).json({ student });
  } catch (error) {
    if (error.message === "User not authenticated") {
      return res.status(401).json({ message: error.message });
    }

    if (
      error.message === "No profile fields provided for update" ||
      error.message === "Email is already in use" ||
      error.message === "Current password is required to change password" ||
      error.message === "Current password is incorrect" ||
      error.message === "New password must be at least 6 characters"
    ) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const student = await studentService.createStudent(10, req.body);
    res.status(201).json({ student });
  } catch (error) {
    if (error.message === "Email is already in use") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
};

const findStudent = async (req, res) => {
  try {
    const token = await studentService.loginStudent(req.body);
    res.status(200).json({ token });
  } catch (error) {
    if (
      error.message === "Student not found" ||
      error.message === "Invalid credentials"
    ) {
      return res.status(401).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAuthStudent,
  updateAuthStudent,
  createStudent,
  findStudent,
};
