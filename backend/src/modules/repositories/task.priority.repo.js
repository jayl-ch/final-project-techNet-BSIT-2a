const TaskPriority = require("../models/task.priority.model");

const createPriorityLevel = async (taskId, priorityLevel) => {
  return await TaskPriority.create({ taskId, priorityLevel });
};

module.exports = { createPriorityLevel };
