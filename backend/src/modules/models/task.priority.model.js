const mongoose = require("mongoose");

const taskPrioritySchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    priorityLevel: {
      type: Number,
      enum: [1, 2, 3],
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
