const Student = require("../models/student.model");

const findById = async (_id) => {
  return await Student.findOne({ _id });
};

const create = async (student) => {
  return await Student.create(student);
};

const findByEmail = async (email) => {
  return await Student.findOne({ email });
};

module.exports = { findById, create, findByEmail };
