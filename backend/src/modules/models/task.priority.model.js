const mongoose = require("mongoose");

const taskPrioritySchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      unique: true,
      index: true,
    },
    priorityLevel: {
      type: String,
      maxlength: 10,
      enum: ["LOW", "MODERATE", "CRITICAL"],
      required: true,
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
