const express = require("express");

const {
  getTasks,
  createTask,
  updateTask,
} = require("../controllers/task.controller");

const taskRouter = express.Router();

const authMiddleware = require("../middlewares/task.middleware");

// GET ALL THE TASKS
taskRouter.get("/tasks", authMiddleware, async (req, res) => {
  const { id } = req.student;
  try {
    const tasks = await getTasks(id);
    if (!tasks) return res.json({ message: "Tasks is empty." });

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE TASK
taskRouter.post("/task/create", async (req, res) => {
  const task = req.body;

  try {
    const newTask = await createTask(task);
    res.status(201).json({ newTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE TASK
taskRouter.put("/task/update/:id", async (req, res) => {
  const task = req.body;
  try {
    const newTask = await updateTask(req.params.id, task);
    if (!newTask)
      res.status(404).json({ message: "Task not found or unauthorized" });

    res.status(200).json({ newTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = taskRouter;
