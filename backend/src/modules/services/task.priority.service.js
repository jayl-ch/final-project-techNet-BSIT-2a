const { findByIdAndCreator } = require("../repositories/task.repo");
const { createPriorityLevel } = require("../repositories/task.priority.repo");

const setPriorityLevel = async (taskId, studentId) => {
  const task = await findByIdAndCreator(taskId, studentId);

  if (!task) throw new Error("Task not found");

  const { deadline, difficulty } = task;

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

  const priorityScore = urgencyScore * 0.7 + difficulty * 0.3;

  let priority;

  if (priorityScore >= 4.5) priority = "CRITICAL";
  else if (priorityScore >= 3) priority = "MODERATE";
  else priority = "LOW";

  return await createPriorityLevel(taskId, priority);
};

module.exports = { setPriorityLevel };
