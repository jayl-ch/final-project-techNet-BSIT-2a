const groupService = require("../services/group.service");
const asyncHandler = require("../middlewares/async.handler");

const createGroup = asyncHandler(async (req, res) => {
  const group = req.body;
  const { id } = req.student;
  const newGroup = await groupService.createGroup(group, id);
  res.status(201).json({ newGroup });
});

const joinGroup = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const { id } = req.student;
  const member = await groupService.joinGroup(code, id);
  res.status(200).json({ member });
});

const getGroups = asyncHandler(async (req, res) => {
  const { id } = req.student;
  const groups = await groupService.getGroupsByStudent(id);
  res.status(200).json({ groups });
});

const getGroupDetails = asyncHandler(async (req, res) => {
  const { id } = req.student;
  const data = await groupService.getGroupDetails(req.params.id, id);
  res.status(200).json(data);
});

const deleteGroup = asyncHandler(async (req, res) => {
  const { id } = req.student;
  const group = await groupService.deleteById(req.params.id, id);

  res.status(200).json({ group });
});

const removeMember = asyncHandler(async (req, res) => {
  const { id } = req.student;
  const removed = await groupService.removeMember(
    req.params.id,
    id,
    req.params.memberId,
  );

  res.status(200).json({ removed });
});

const leaveGroup = asyncHandler(async (req, res) => {
  const { id } = req.student;
  const result = await groupService.leaveGroup(req.params.id, id);

  res.status(200).json({ result });
});

module.exports = {
  createGroup,
  joinGroup,
  getGroups,
  getGroupDetails,
  deleteGroup,
  removeMember,
  leaveGroup,
};
