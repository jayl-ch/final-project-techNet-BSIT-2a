const groupRepo = require("../repositories/group.repo");
const {
  createMember,
  findByGroupStudent,
  findByStudentId,
  findByGroupIdWithStudent,
  countMembersByGroupIds,
  deleteByGroupStudent,
  deleteByGroupId,
} = require("../repositories/group.member.repo");
const {
  findByGroupIdWithTaskAndStudent,
  deleteByGroupId: deleteAssignmentsByGroupId,
  deleteByGroupAndStudent,
} = require("../repositories/task.assignment.repo");
const {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors");

const generateInviteCode = () => {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
};

const resolveUniqueInviteCode = async (requestedCode) => {
  const normalizedRequestedCode =
    typeof requestedCode === "string" ? requestedCode.trim().toUpperCase() : "";

  if (normalizedRequestedCode) {
    const existingByRequestedCode = await groupRepo.findByCode(normalizedRequestedCode);
    if (existingByRequestedCode) {
      throw new ConflictError("Invite code already exists");
    }
    return normalizedRequestedCode;
  }

  let inviteCode = generateInviteCode();
  let existing = await groupRepo.findByCode(inviteCode);

  while (existing) {
    inviteCode = generateInviteCode();
    existing = await groupRepo.findByCode(inviteCode);
  }

  return inviteCode;
};

const createGroup = async (groupInfo, id) => {
  const name = typeof groupInfo?.name === "string" ? groupInfo.name.trim() : "";

  if (!name) {
    throw new BadRequestError("Group name is required");
  }

  const inviteCode = await resolveUniqueInviteCode(groupInfo?.inviteCode);

  const newGroup = await groupRepo.create({ name, inviteCode }, id);
  await createMember(newGroup._id, id, "admin");

  return newGroup;
};

const joinGroup = async (code, id) => {
  const normalizedCode = typeof code === "string" ? code.trim().toUpperCase() : "";

  if (!normalizedCode) {
    throw new BadRequestError("Invite code is required");
  }

  const group = await groupRepo.findByCode(normalizedCode);
  if (!group) throw new BadRequestError("Invalid code");

  const existing = await findByGroupStudent(group._id, id);

  if (existing) throw new ConflictError("Already joined");
  return await createMember(group._id, id, "member");
};

const getGroupsByStudent = async (id) => {
  const ownedGroups = await groupRepo.findByOwner(id);
  const memberLinks = await findByStudentId(id);

  const ownedGroupIdSet = new Set(ownedGroups.map((group) => String(group._id)));
  const memberGroupIds = memberLinks
    .map((link) => String(link.groupId))
    .filter((groupId) => !ownedGroupIdSet.has(groupId));

  const joinedGroups = memberGroupIds.length
    ? await groupRepo.findByIds(memberGroupIds)
    : [];

  const groups = [...ownedGroups, ...joinedGroups];
  const groupIds = groups.map((group) => group._id);
  const memberCounts = groupIds.length
    ? await countMembersByGroupIds(groupIds)
    : {};

  return groups.map((group) => ({
    ...group.toObject(),
    memberCount: memberCounts[String(group._id)] || 0,
    isOwner: String(group.owner) === String(id),
  }));
};

const getGroupDetails = async (groupId, studentId) => {
  const group = await groupRepo.findByGroupId(groupId);

  if (!group) {
    throw new NotFoundError("Group not found");
  }

  const isOwner = String(group.owner) === String(studentId);
  const membership = await findByGroupStudent(groupId, studentId);

  if (!isOwner && !membership) {
    throw new ForbiddenError("Unauthorized");
  }

  const members = await findByGroupIdWithStudent(groupId);
  const assignments = await findByGroupIdWithTaskAndStudent(groupId);

  const assignmentsByStudentId = assignments.reduce((acc, assignment) => {
    const studentKey = String(assignment.assignedTo?._id || assignment.assignedTo);

    if (!acc[studentKey]) {
      acc[studentKey] = [];
    }

    acc[studentKey].push({
      assignmentId: assignment._id,
      taskId: assignment.taskId?._id,
      taskName: assignment.taskId?.name || "Untitled Task",
      subject: assignment.taskId?.subject || "General",
      status: assignment.taskId?.status || "pending",
      deadline: assignment.taskId?.deadline,
      difficulty: assignment.taskId?.difficulty,
    });

    return acc;
  }, {});

  const memberItems = members.map((member) => {
    const student = member.studentId;
    const studentKey = String(student?._id || member.studentId);

    return {
      id: student?._id,
      name: student?.name || "Unknown Student",
      email: student?.email || "",
      role: member.role,
      tasks: assignmentsByStudentId[studentKey] || [],
    };
  });

  return {
    group: {
      id: group._id,
      name: group.name,
      inviteCode: group.inviteCode,
      owner: group.owner,
      isOwner,
    },
    members: memberItems,
  };
};

const deleteById = async (groupId, studentId) => {
  const group = await groupRepo.findByGroupId(groupId);

  if (!group) throw new NotFoundError("Group not found");

  if (String(group.owner) !== String(studentId)) {
    throw new ForbiddenError("Only admin can delete group");
  }

  await Promise.all([
    deleteAssignmentsByGroupId(groupId),
    deleteByGroupId(groupId),
    groupRepo.deleteById(groupId),
  ]);

  return group;
};

const removeMember = async (groupId, adminId, memberId) => {
  const group = await groupRepo.findByGroupId(groupId);

  if (!group) throw new NotFoundError("Group not found");

  if (String(group.owner) !== String(adminId)) {
    throw new ForbiddenError("Only admin can remove members");
  }

  if (String(adminId) === String(memberId)) {
    throw new ForbiddenError("Admin cannot remove themselves");
  }

  const member = await findByGroupStudent(groupId, memberId);

  if (!member) {
    throw new NotFoundError("Member not found in this group");
  }

  if (member.role === "admin") {
    throw new ForbiddenError("Admin cannot be removed");
  }

  await Promise.all([
    deleteByGroupStudent(groupId, memberId),
    deleteByGroupAndStudent(groupId, memberId),
  ]);

  return { memberId };
};

const leaveGroup = async (groupId, studentId) => {
  const group = await groupRepo.findByGroupId(groupId);

  if (!group) throw new NotFoundError("Group not found");

  if (String(group.owner) === String(studentId)) {
    throw new ForbiddenError("Admin cannot leave group. Delete the group instead");
  }

  const member = await findByGroupStudent(groupId, studentId);

  if (!member) {
    throw new ForbiddenError("You are not a member of this group");
  }

  await Promise.all([
    deleteByGroupStudent(groupId, studentId),
    deleteByGroupAndStudent(groupId, studentId),
  ]);

  return { groupId };
};

module.exports = {
  createGroup,
  joinGroup,
  getGroupsByStudent,
  getGroupDetails,
  deleteById,
  removeMember,
  leaveGroup,
};
