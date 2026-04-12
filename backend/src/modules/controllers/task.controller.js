const Task = require("../models/task.model");
const mongoose = require("mongoose");

const getTasks = async (id) => {
  return await Task.find({ creator: new mongoose.Types.ObjectId(id) });
};

const createTask = async (task, id) => {
  return await Task.create({
    ...task,
    creator: new mongoose.Types.ObjectId(id),
  });
};

const updateTask = async (taskId, task) => {
  return await Task.findByIdAndUpdate(
    taskId,
    { $set: task },
    {
      new: true,
      runValidators: true,
    },
  );
};

module.exports = { getTasks, createTask, updateTask };
