const Group = require("../models/group.model");

const create = async (groupInfo, owner) => {
  return await Group.create({
    ...groupInfo,
    owner,
  });
};

const findByGroupId = async (_id) => {
  return await Group.findById(_id);
};

const findByCode = async (inviteCode) => {
  return await Group.findOne({
    inviteCode,
  });
};

const findByOwner = async (owner) => {
  return await Group.find({ owner });
};

const deleteById = async (id) => {
  return await Group.findByIdAndDelete(id);
};

const findByIdAndOwner = async (_id, owner) => {
  return await Group.findOne({
    _id,
    owner,
  });
};

module.exports = {
  create,
  findByCode,
  findByOwner,
  findByGroupId,
  findByIdAndOwner,
  deleteById,
};
