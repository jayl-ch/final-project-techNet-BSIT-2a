const mongoose = require("mongoose");

const taskPrioritySchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    priorityLevel: {
      type: String,
      maxlength: 10,
    },
  },
  { timestamps: true },
);

const TaskPriority = mongoose.model(
  "TaskPriority",
  taskPrioritySchema,
  "task_priorities",
);

module.exports = TaskPriority;
