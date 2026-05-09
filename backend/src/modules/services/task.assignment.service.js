const { findByGroupId } = require("../repositories/group.repo");
const { findByIdAndCreator } = require("../repositories/task.repo");
const {
  existsByTaskUserGroup,
  findByTaskAndGroup,
  createTaskAssignment,
  deleteByTaskAndGroup,
} = require("../repositories/task.assignment.repo");
const { findByGroupStudent } = require("../repositories/group.member.repo");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

const assignTask = async ({ taskId, assignedTo, groupId }, { id }) => {
  const group = await findByGroupId(groupId);

  if (!group) throw new NotFoundError("Group not found");

  if (group.owner.toString() !== id) throw new ForbiddenError("Unauthorized member");

  const task = await findByIdAndCreator(taskId, id);
  if (!task) {
    throw new ForbiddenError("Task does not belong to this group admin");
  }

  const groupMember = await findByGroupStudent(groupId, assignedTo);

  if (!groupMember) throw new BadRequestError("Student not in a group");

  const existingAssignment = await findByTaskAndGroup(taskId, groupId);

  if (existingAssignment) {
    if (existingAssignment.assignedTo.toString() === assignedTo.toString()) {
      throw new ConflictError("Task already assigned to this student");
    }

    throw new ConflictError("Task already assigned to another member");
  }

  const existing = await existsByTaskUserGroup(taskId, assignedTo, groupId);

  if (existing) throw new ConflictError("Task already assigned to this student");

  return await createTaskAssignment(taskId, assignedTo, groupId);
};

const unassignTask = async ({ taskId, groupId }, { id }) => {
  const group = await findByGroupId(groupId);

  if (!group) throw new NotFoundError("Group not found");

  if (group.owner.toString() !== id) throw new ForbiddenError("Unauthorized member");

  const task = await findByIdAndCreator(taskId, id);
  if (!task) {
    throw new ForbiddenError("Task does not belong to this group admin");
  }

  const deleted = await deleteByTaskAndGroup(taskId, groupId);

  if (!deleted) throw new NotFoundError("Task assignment not found");

  return deleted;
};

module.exports = { assignTask, unassignTask };
