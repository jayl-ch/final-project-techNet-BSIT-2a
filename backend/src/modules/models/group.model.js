const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 20,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  },
  { timestamps: true },
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
