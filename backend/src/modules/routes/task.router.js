const express = require("express");

const {
  getTasks,
  createTask,
  updateTask,
} = require("../controllers/task.controller");

const taskRouter = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

// GET ALL THE TASKS
taskRouter.get("/task", authMiddleware, async (req, res) => {
  const { id } = req.student;
  try {
    const tasks = await getTasks(id);

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE TASK
taskRouter.post("/task/create", authMiddleware, async (req, res) => {
  const task = req.body;
  const { id } = req.student;

  try {
    const newTask = await createTask(task, id);
    res.status(201).json({ newTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE TASK
taskRouter.patch("/task/update/:id", async (req, res) => {
  try {
    const allowedFields = ["name", "difficulty", "deadline"];
    const task = {};

    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        task[key] = req.body[key];
      }
    }

    const newTask = await updateTask(req.params.id, task);

    if (!newTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ newTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = taskRouter;
