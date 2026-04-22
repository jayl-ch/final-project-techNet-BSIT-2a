const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 50,
      required: true,
    },
    email: {
      type: String,
      maxlength: 255,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      maxlength: 60,
      required: true,
    },
  },
  { timestamps: true },
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
