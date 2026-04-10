const mongoose = require("mongoose");

const groupMemberSchema = new mongoose.schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    role: {
      type: String,
      maxlength: 6,
    },
  },
  { timestamps: true },
);

const GroupMember = mongoose.model(
  "GroupMember",
  groupMemberSchema,
  "group_members",
);

module.exports = GroupMember;
