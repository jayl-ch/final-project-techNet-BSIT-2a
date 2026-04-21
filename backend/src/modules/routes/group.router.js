const express = require("express");

const {
  createGroup,
  joinGroup,
  getGroups,
  getGroupDetails,
  deleteGroup,
  removeMember,
  leaveGroup,
} = require("../controllers/group.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validateRequest = require("../middlewares/validate.middleware");
const {
  validateCreateGroup,
  validateJoinGroup,
} = require("../validators/request.validators");

const groupRouter = express.Router();

// GET GROUPS
groupRouter.get("/group", authMiddleware, getGroups);
// GET GROUP DETAILS (MEMBERS + ASSIGNED TASKS)
groupRouter.get("/group/:id/details", authMiddleware, getGroupDetails);
// CREATE GROUP
groupRouter.post(
  "/group/create",
  authMiddleware,
  validateRequest(validateCreateGroup),
  createGroup,
);
// JOIN GROUP
groupRouter.post(
  "/group/join",
  authMiddleware,
  validateRequest(validateJoinGroup),
  joinGroup,
);
// DELETE GROUP
groupRouter.delete("/group/delete/:id", authMiddleware, deleteGroup);
// REMOVE MEMBER (ADMIN ONLY)
groupRouter.delete("/group/:id/member/:memberId", authMiddleware, removeMember);
// LEAVE GROUP (MEMBER ONLY)
groupRouter.delete("/group/:id/leave", authMiddleware, leaveGroup);

module.exports = groupRouter;
