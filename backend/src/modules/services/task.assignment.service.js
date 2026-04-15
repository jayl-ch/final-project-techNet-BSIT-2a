const { findByGroupId } = require("../repositories/group.repo");
const {
  existsByTaskUserGroup,
  createTaskAssignment,
} = require("../repositories/task.assignment.repo");
const { findByGroupStudent } = require("../repositories/group.member.repo");

const assignTask = async ({ taskId, assignedTo, groupId }, { id }) => {
  const group = await findByGroupId(groupId);

  if (!group) throw new Error("Group not found");

  if (group.owner.toString() !== id) throw new Error("Unauthorized member");

  const groupMember = await findByGroupStudent(groupId, assignedTo);

  if (!groupMember) throw new Error("Student not in a group");

  const existing = await existsByTaskUserGroup(taskId, assignedTo, groupId);

  if (existing) throw new Error("Task already assigned to this student");

  return await createTaskAssignment(taskId, assignedTo, groupId);
};

module.exports = { assignTask };
