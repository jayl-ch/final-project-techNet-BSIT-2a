const TaskAssignment = require("../models/task.assignment.model");

const existsByTaskUserGroup = async (taskId, assignedTo, groupId) => {
  return await TaskAssignment.findOne({ taskId, assignedTo, groupId });
};

const createTaskAssignment = async (taskId, assignedTo, groupId) => {
  return await TaskAssignment.create({ taskId, assignedTo, groupId });
};

const findByGroupIdWithTaskAndStudent = async (groupId) => {
  return await TaskAssignment.find({ groupId })
    .populate("taskId", "name subject deadline difficulty status")
    .populate("assignedTo", "name email");
};

const deleteByGroupId = async (groupId) => {
  return await TaskAssignment.deleteMany({ groupId });
};

const deleteByGroupAndStudent = async (groupId, assignedTo) => {
  return await TaskAssignment.deleteMany({ groupId, assignedTo });
};

module.exports = {
  existsByTaskUserGroup,
  createTaskAssignment,
  findByGroupIdWithTaskAndStudent,
  deleteByGroupId,
  deleteByGroupAndStudent,
};
