const GroupMember = require("../models/group.member.model");

const createMember = async (groupId, studentId, role) => {
  return await GroupMember.create({ groupId, studentId, role });
};

const findByGroupStudent = async (groupId, studentId) => {
  return await GroupMember.findOne({
    groupId,
    studentId,
  });
};

const findByStudentId = async (studentId) => {
  return await GroupMember.find({ studentId });
};

const findByGroupIdWithStudent = async (groupId) => {
  return await GroupMember.find({ groupId }).populate("studentId", "name email");
};

const deleteByGroupId = async (groupId) => {
  return await GroupMember.deleteMany({ groupId });
};

module.exports = {
  createMember,
  findByGroupStudent,
  findByStudentId,
  findByGroupIdWithStudent,
  deleteByGroupId,
};
