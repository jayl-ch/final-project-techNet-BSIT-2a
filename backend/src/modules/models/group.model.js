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
    inviteCode: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
