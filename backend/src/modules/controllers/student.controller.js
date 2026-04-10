const Student = require("../models/student.model");

const createStudent = async (student) => {
  return await Student.create(student);
};

const findStudent = async (email) => {
  return await Student.findOne({ email });
};

const findStudentById = async (id) => {
  return await Student.findById(id);
};

// TESTING PURPOSES
const getAllStudents = async () => {
  return await Student.find();
};

module.exports = {
  createStudent,
  findStudent,
  findStudentById,
  getAllStudents,
};
