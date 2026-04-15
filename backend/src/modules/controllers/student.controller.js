const studentService = require("../services/student.service");

const createStudent = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const student = await studentService.createStudent(password, 10, {
      name,
      email,
    });
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

module.exports = { createStudent, findStudent };
