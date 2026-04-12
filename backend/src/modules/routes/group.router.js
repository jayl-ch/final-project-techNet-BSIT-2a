const express = require("express");

const {
  createGroup,
  joinGroup,
  getGroups,
} = require("../controllers/group.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const groupRouter = express.Router();

groupRouter.get("/group", authMiddleware, async (req, res) => {
  const { id } = req.student;
  try {
    const groups = await getGroups(id);

    res.status(200).json({ groups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE GROUP
groupRouter.post("/group/create", authMiddleware, async (req, res) => {
  const group = req.body;
  const { id } = req.student;
  try {
    const newGroup = await createGroup(group, id);

    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// JOIN GROUP
groupRouter.post("/group/join", authMiddleware, async (req, res) => {
  const { code } = req.body;
  const { id } = req.student;
  try {
    const member = await joinGroup(code, id);
    res.status(200).json({ member });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = groupRouter;
