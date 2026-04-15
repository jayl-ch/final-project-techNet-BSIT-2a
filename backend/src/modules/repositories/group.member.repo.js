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

module.exports = { createMember, findByGroupStudent };
