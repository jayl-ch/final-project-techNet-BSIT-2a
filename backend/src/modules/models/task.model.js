const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 20,
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
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
