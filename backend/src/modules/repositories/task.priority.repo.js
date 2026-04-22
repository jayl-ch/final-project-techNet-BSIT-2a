const TaskPriority = require("../models/task.priority.model");

const createPriorityLevel = async (taskId, priorityLevel) => {
  return await TaskPriority.create({ taskId, priorityLevel });
};

const upsertPriorityLevel = async (taskId, priorityLevel) => {
  return await TaskPriority.findOneAndUpdate(
    { taskId },
    { $set: { priorityLevel } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
};

const findByTaskIds = async (taskIds) => {
  if (!Array.isArray(taskIds) || !taskIds.length) {
    return [];
  }

  return await TaskPriority.find({ taskId: { $in: taskIds } }).sort({
    updatedAt: -1,
  });
};

module.exports = { createPriorityLevel, upsertPriorityLevel, findByTaskIds };
