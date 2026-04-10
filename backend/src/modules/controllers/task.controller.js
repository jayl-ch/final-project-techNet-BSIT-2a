const Task = require("../models/task.model");
const mongoose = require("mongoose");

const getTasks = async (id) => {
  return await Task.find({ creator: new mongoose.Types.ObjectId(id) });
};

const createTask = async (task) => {
  return await Task.create(task);
};

const updateTask = async (task, taskId) => {
  return await Task.findOneAndUpdate(taskId, task, {
    new: true,
    runValidators: true,
  });
};

module.exports = { getTasks, createTask, updateTask };
