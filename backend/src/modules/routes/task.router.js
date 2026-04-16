const express = require("express");

const taskRouter = express.Router();

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");

const { setPriority } = require("../controllers/task.priority.controller");
const assignTask = require("../controllers/task.assignment.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// GET ALL THE TASKS
taskRouter.get("/task", authMiddleware, getTasks);

// CREATE TASK
taskRouter.post("/task/create", authMiddleware, createTask);

// UPDATE TASK
taskRouter.patch("/task/update/:id", authMiddleware, updateTask);

// TASK ASSIGNMENT
taskRouter.post("/task/assign", authMiddleware, assignTask);

// TASK PRIORITY
taskRouter.post("/task/priority/:id", authMiddleware, setPriority);

// DELETE TASK
taskRouter.delete("/task/delete/:id", authMiddleware, deleteTask);

module.exports = taskRouter;
