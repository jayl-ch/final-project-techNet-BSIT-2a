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

const deleteTask = async (taskId, studentId) => {
  const task = await Task.findOne({
    _id: new mongoose.Types.ObjectId(taskId),
    creator: new mongoose.Types.ObjectId(studentId),
  });

  if (!task) throw new Error("Task not found");

  await Task.findByIdAndDelete(taskId);

  return task;
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
