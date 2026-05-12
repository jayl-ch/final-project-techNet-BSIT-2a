const { findAll: findAllStudents } = require("../repositories/student.repo");
const { findAll: findAllGroups } = require("../repositories/group.repo");
const { findAll: findAllGroupMembers } = require("../repositories/group.member.repo");
const { findAll: findAllTasks } = require("../repositories/task.repo");
const {
  findAllWithTaskAndGroup,
} = require("../repositories/task.assignment.repo");

const toTaskSummary = (task) => ({
  id: task?._id,
  name: task?.name || "Untitled Task",
  subject: task?.subject || "General",
  status: task?.status || "pending",
  deadline: task?.deadline ?? null,
  difficulty: task?.difficulty ?? null,
});

const normalizeDate = (value) => {
  if (!value) {
    return 0;
  }

  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const listUsers = async () => {
  const [students, groups, groupMembers, tasks, assignments] = await Promise.all([
    findAllStudents(),
    findAllGroups(),
    findAllGroupMembers(),
    findAllTasks(),
    findAllWithTaskAndGroup(),
  ]);

  const usersById = new Map();

  (students || []).forEach((student) => {
    const id = String(student._id);
    usersById.set(id, {
      id: student._id,
      name: student.name || "Unknown Student",
      email: student.email || "",
      role: student.role || "user",
      createdAt: student.createdAt ?? null,
      updatedAt: student.updatedAt ?? null,
      groups: [],
      tasks: {
        created: [],
        assigned: [],
      },
    });
  });

  const groupsById = new Map(
    (groups || []).map((group) => [String(group._id), group]),
  );

  (groupMembers || []).forEach((member) => {
    const studentId = String(member.studentId);
    const user = usersById.get(studentId);

    if (!user) {
      return;
    }

    const group = groupsById.get(String(member.groupId));

    if (!group) {
      return;
    }

    user.groups.push({
      id: group._id,
      name: group.name || "Untitled Group",
      role: member.role || "member",
      isOwner: String(group.owner) === studentId,
    });
  });

  (tasks || []).forEach((task) => {
    const studentId = String(task.creator);
    const user = usersById.get(studentId);

    if (!user) {
      return;
    }

    user.tasks.created.push(toTaskSummary(task));
  });

  (assignments || []).forEach((assignment) => {
    const studentId = String(assignment.assignedTo);
    const user = usersById.get(studentId);

    if (!user) {
      return;
    }

    const task = assignment.taskId;

    if (!task) {
      return;
    }

    user.tasks.assigned.push({
      ...toTaskSummary(task),
      groupId: assignment.groupId?._id || assignment.groupId || null,
      groupName: assignment.groupId?.name || "",
    });
  });

  return Array.from(usersById.values())
    .map((user) => ({
      ...user,
      groups: [...user.groups].sort((left, right) =>
        left.name.localeCompare(right.name),
      ),
      tasks: {
        created: [...user.tasks.created].sort(
          (left, right) => normalizeDate(left.deadline) - normalizeDate(right.deadline),
        ),
        assigned: [...user.tasks.assigned].sort(
          (left, right) => normalizeDate(left.deadline) - normalizeDate(right.deadline),
        ),
      },
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
};

module.exports = { listUsers };
