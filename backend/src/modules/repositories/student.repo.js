const Student = require("../models/student.model");

const create = async (student) => {
  return await Student.create(student);
};

const findByEmail = async (email) => {
  return await Student.findOne({ email });
};

module.exports = { create, findByEmail };
