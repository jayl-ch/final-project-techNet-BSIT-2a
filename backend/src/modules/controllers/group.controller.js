const groupService = require("../services/group.service");

const createGroup = async (req, res) => {
  const group = req.body;
  const { id } = req.student;
  try {
    const newGroup = await groupService.createGroup(group, id);
    res.status(201).json({ newGroup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const joinGroup = async (req, res) => {
  const { code } = req.body;
  const { id } = req.student;

  try {
    const member = await groupService.joinGroup(code, id);
    res.status(200).json({ member });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getGroups = async (req, res) => {
  const { id } = req.student;
  try {
    const groups = await groupService.getGroupsByOwner(id);
    res.status(200).json({ groups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteGroup = async (req, res) => {
  const { id } = req.student;

  try {
    const group = await groupService.deleteById(req.params.id, id);

    res.status(200).json({ group });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createGroup, joinGroup, getGroups, deleteGroup };
