const Task = require("../models/task.model");

const findByCreator = async (creator) => {
  return await Task.find({ creator });
};

const create = async (taskInfo, creator) => {
  return await Task.create({
    ...taskInfo,
    creator,
  });
};

const findByIdAndCreator = async (_id, creator) => {
  return await Task.findOne({ _id, creator });
};

const findById = async (_id) => {
  return await Task.findById(_id);
};

const updateById = async (taskId, task) => {
  return await Task.findByIdAndUpdate(
    taskId,
    { $set: task },
    { new: true, runValidators: true },
  );
};

const deleteById = async (taskId) => {
  return await Task.findByIdAndDelete(taskId);
};

module.exports = {
  findByCreator,
  create,
  findByIdAndCreator,
  findById,
  updateById,
  deleteById,
};
