const mongoose = require("mongoose");

const taskAssignmentSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

taskAssignmentSchema.index({ taskId: 1, assignedTo: 1, groupId: 1 }, { unique: true });
taskAssignmentSchema.index({ groupId: 1, assignedTo: 1 });

const TaskAssignment = mongoose.model(
  "TaskAssignment",
  taskAssignmentSchema,
  "task_assignments",
);

module.exports = TaskAssignment;
