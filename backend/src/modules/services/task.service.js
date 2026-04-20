const {
  create,
  findByCreator,
  findByIdAndCreator,
  updateById,
  deleteById,
} = require("../repositories/task.repo");
const { syncTaskPriorities } = require("./task.priority.service");

const getTasksByCreator = async (id) => {
  const tasks = await findByCreator(id);
  const priorityByTaskId = await syncTaskPriorities(tasks);

  return tasks.map((task) => {
    const taskData =
      typeof task.toObject === "function" ? task.toObject() : task;

    return {
      ...taskData,
      priorityLevel: priorityByTaskId[String(taskData._id)] || "LOW",
    };
  });
};

const createTask = async (task, id) => {
  return await create(task, id);
};

const updateTask = async (taskId, studentId, taskInfo) => {
  const allowedFields = ["name", "difficulty", "deadline", "subject", "status"];
  const task = {};

  for (let key of allowedFields) {
    if (taskInfo[key] !== undefined) {
      task[key] = taskInfo[key];
    }
  }

  const foundedTask = await findByIdAndCreator(taskId, studentId);

  if (!foundedTask) throw new Error("Unauthorized");

  const newTask = await updateById(taskId, task);

  if (!newTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  return newTask;
};

const deleteTask = async (taskId, studentId) => {
  const task = await findByIdAndCreator(taskId, studentId);
  if (!task) throw new Error("Unauthorized");

  await deleteById(taskId);
  return task;
};

module.exports = { getTasksByCreator, createTask, updateTask, deleteTask };
