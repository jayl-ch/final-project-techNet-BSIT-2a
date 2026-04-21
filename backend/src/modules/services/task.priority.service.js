const { findByIdAndCreator } = require("../repositories/task.repo");
const { upsertPriorityLevel } = require("../repositories/task.priority.repo");
const { NotFoundError } = require("../utils/errors");

const calculatePriorityLevel = ({ deadline, difficulty }) => {
  const now = new Date();
  const dueDate = new Date(deadline);

  const timeDiff = dueDate - now;
  const daysRemaining = timeDiff / (1000 * 60 * 60 * 24);

  let urgencyScore;

  if (daysRemaining <= 1) urgencyScore = 5;
  else if (daysRemaining <= 3) urgencyScore = 4;
  else if (daysRemaining <= 7) urgencyScore = 3;
  else if (daysRemaining <= 14) urgencyScore = 2;
  else urgencyScore = 1;

  const normalizedDifficulty = Number.isFinite(difficulty) ? difficulty : 1;
  const priorityScore = urgencyScore * 0.7 + normalizedDifficulty * 0.3;

  if (priorityScore >= 4.5) return "CRITICAL";
  if (priorityScore >= 3) return "MODERATE";
  return "LOW";
};

const setPriorityLevel = async (taskId, studentId) => {
  const task = await findByIdAndCreator(taskId, studentId);

  if (!task) throw new NotFoundError("Task not found");

  const priorityLevel = calculatePriorityLevel(task);
  return await upsertPriorityLevel(taskId, priorityLevel);
};

const syncTaskPriorities = async (tasks) => {
  if (!Array.isArray(tasks) || !tasks.length) {
    return {};
  }

  const syncedPriorityEntries = await Promise.all(
    tasks.map(async (task) => {
      const priorityLevel = calculatePriorityLevel(task);
      const syncedPriority = await upsertPriorityLevel(task._id, priorityLevel);

      return [String(task._id), syncedPriority.priorityLevel];
    }),
  );

  return Object.fromEntries(syncedPriorityEntries);
};

module.exports = { setPriorityLevel, syncTaskPriorities, calculatePriorityLevel };
