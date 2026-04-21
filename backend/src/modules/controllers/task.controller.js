const taskService = require("../services/task.service");
const asyncHandler = require("../middlewares/async.handler");

const getTasks = asyncHandler(async (req, res) => {
  const { id } = req.student;
  const tasks = await taskService.getTasksByCreator(id);
  res.status(200).json({ tasks });
});

const createTask = asyncHandler(async (req, res) => {
  const task = req.body;
  const { id } = req.student;
  const newTask = await taskService.createTask(task, id);
  res.status(201).json({ newTask });
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.student;
  const newTask = await taskService.updateTask(req.params.id, id, req.body);
  res.status(200).json({ newTask });
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.student;
  const task = await taskService.deleteTask(req.params.id, id);
  res.status(200).json({ task });
});

module.exports = { getTasks, createTask, updateTask, deleteTask };
