const Group = require("../models/group.model");
const GroupMember = require("../models/group.member.model");

const createGroup = async (group) => {
  return await Group.create(group);
};

const joinGroup = async (membership) => {
  return await GroupMember.create(membership);
};

module.exports = { createGroup, joinGroup };
