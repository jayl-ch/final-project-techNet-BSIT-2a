const express = require("express");

const {
  createGroup,
  joinGroup,
  getGroups,
  deleteGroup,
} = require("../controllers/group.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const groupRouter = express.Router();

// GET GROUPS
groupRouter.get("/group", authMiddleware, getGroups);
// CREATE GROUP
groupRouter.post("/group/create", authMiddleware, createGroup);
// JOIN GROUP
groupRouter.post("/group/join", authMiddleware, joinGroup);
// DELETE GROUP
groupRouter.delete("/group/delete/:id", authMiddleware, deleteGroup);

module.exports = groupRouter;
