const Group = require("../models/group.model");
const GroupMember = require("../models/group.member.model");
const mongoose = require("mongoose");

const createGroup = async (group, id) => {
  return await Group.create({
    ...group,
    owner: new mongoose.Types.ObjectId(id),
  });
};

const joinGroup = async (code, id) => {
  const group = await Group.findOne({ inviteCode: code });
  if (!group) throw new Error("Invalid code");

  const existing = await GroupMember.findOne({
    groupId: group._id,
    studentId: id,
  });

  if (existing) throw new Error("Already joined");

  return await GroupMember.create({
    groupId: group._id,
    studentId: id,
    role: "member",
  });
};

const getGroups = async (id) => {
  return await Group.find({ owner: new mongoose.Types.ObjectId(id) });
};

module.exports = { createGroup, joinGroup, getGroups };
