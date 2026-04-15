const {
  create,
  findByCode,
  findByOwner,
  findByIdAndOwner,
} = require("../repositories/group.repo");
const {
  createMember,
  findByGroupStudent,
} = require("../repositories/group.member.repo");

const createGroup = async (groupInfo, id) => {
  const newGroup = await create({ ...groupInfo, id });
  await createMember(newGroup._id, studentId, "admin");

  return newGroup;
};

const joinGroup = async (code, id) => {
  const group = await findByCode(code);
  if (!group) throw new Error("Invalid code");

  const existing = await findByGroupStudent(group._id, id);

  if (existing) throw new Error("Already joined");
  return await createMember(group._id, id, "member");
};

const getGroupsByOwner = async (id) => {
  return await findByOwner(id);
};

const deleteById = async (groupId, studentId) => {
  const group = await findByIdAndOwner(groupId, studentId);

  if (!group) throw new Error("Group not found");

  await deleteById(id);
  return group;
};

module.exports = { createGroup, joinGroup, getGroupsByOwner, deleteById };
