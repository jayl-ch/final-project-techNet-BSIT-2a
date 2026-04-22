const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 20,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    inviteCode: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
  },
  { timestamps: true },
);

groupSchema.index({ owner: 1, createdAt: -1 });

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
