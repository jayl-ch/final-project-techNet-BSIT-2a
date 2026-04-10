const express = require("express");

const { createGroup, joinGroup } = require("../controllers/group.controller");

const groupRouter = express.Router();

groupRouter.get("/group", (req, res) => {
  res.send({ message: "You are on a group" });
});

// CREATE GROUP
groupRouter.post("/group/create", async (req, res) => {
  const group = req.body;
  try {
    const newGroup = await createGroup(group);

    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// JOIN GROUP
groupRouter.post("/group/join", async (req, res) => {
  const { membership } = req.body;
  try {
    const member = await joinGroup(membership);
    res.status(200).json({ member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = groupRouter;
