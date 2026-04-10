const mongoose = require("mongoose");

const taskAssignmentSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  },
  { timestamps: true },
);

const TaskAssignment = mongoose.model(
  "TaskAssignment",
  taskAssignmentSchema,
  "task_assignments",
);

module.exports = TaskAssignment;
