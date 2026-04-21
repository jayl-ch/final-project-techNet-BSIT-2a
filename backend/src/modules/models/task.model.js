const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 20,
      required: true,
      trim: true,
    },
    difficulty: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
    },
    deadline: {
      type: Date,
      required: true,
    },
    subject: {
      type: String,
      maxlength: 20,
      default: "General",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

taskSchema.index({ creator: 1, status: 1, deadline: 1 });
taskSchema.index({ creator: 1, updatedAt: -1 });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
