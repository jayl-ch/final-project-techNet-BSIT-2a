const {
  create,
  findByCreator,
  findByIdAndCreator,
  updateById,
  deleteById,
} = require("../repositories/task.repo");

const getTasksByCreator = async (id) => {
  return await findByCreator(id);
};

const createTask = async (task, id) => {
  return await create(task, id);
};

const updateTask = async (taskId, studentId, taskInfo) => {
  const allowedFields = ["name", "difficulty", "deadline"];
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
