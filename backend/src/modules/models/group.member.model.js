const mongoose = require("mongoose");

const groupMemberSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    role: {
      type: String,
      maxlength: 6,
      enum: ["admin", "member"],
      required: true,
      default: "member",
    },
  },
  { timestamps: true },
);

groupMemberSchema.index({ groupId: 1, studentId: 1 }, { unique: true });

const GroupMember = mongoose.model(
  "GroupMember",
  groupMemberSchema,
  "group_members",
);

module.exports = GroupMember;
