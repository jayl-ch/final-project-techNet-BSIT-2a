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

const updateById = async (_id, updates) => {
  return await Student.findByIdAndUpdate(_id, updates, {
    new: true,
    runValidators: true,
  });
};

module.exports = { findById, create, findByEmail, updateById };
