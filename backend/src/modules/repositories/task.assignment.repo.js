const TaskAssignment = require("../models/task.assignment.model");

const existsByTaskUserGroup = async (taskId, assignedTo, groupId) => {
  return await TaskAssignment.findOne({ taskId, assignedTo, groupId });
};

const createTaskAssignment = async (taskId, assignedTo, groupId) => {
  return await TaskAssignment.create({ taskId, assignedTo, groupId });
};

module.exports = { existsByTaskUserGroup, createTaskAssignment };
