const studentService = require("../services/student.service");

const getAuthStudent = async (req, res) => {
  const { id } = req.student;
  try {
    const student = await studentService.getAuthStudent(id);
    res.status(200).json({ student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const student = await studentService.createStudent(10, req.body);
    res.status(201).json({ student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const findStudent = async (req, res) => {
  try {
    const token = await studentService.loginStudent(req.body);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAuthStudent, createStudent, findStudent };
