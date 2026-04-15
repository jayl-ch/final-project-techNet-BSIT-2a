const taskService = require("../services/task.service");

const getTasks = async (req, res) => {
  const { id } = req.student;
  try {
    const tasks = await taskService.getTasksByCreator(id);

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  const task = req.body;
  const { id } = req.student;
  try {
    const newTask = await taskService.createTask(task, id);
    res.status(201).json({ newTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.student;
  try {
    const newTask = await taskService.updateTask(req.params.id, id, req.body);
    res.status(200).json({ newTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.student;
  try {
    const task = taskService.deleteTask(req.params.id, id);

    res.status(200).json({ task });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
