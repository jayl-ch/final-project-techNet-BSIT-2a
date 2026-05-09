const taskAssignService = require("../services/task.assignment.service");
const asyncHandler = require("../middlewares/async.handler");

const assignTask = asyncHandler(async (req, res) => {
  const assigned = await taskAssignService.assignTask(req.body, req.student);
  res.status(201).json({ assigned, message: "Task assigned successfuly" });
});

const unassignTask = asyncHandler(async (req, res) => {
  const unassigned = await taskAssignService.unassignTask(req.body, req.student);
  res.status(200).json({
    unassigned,
    message: "Task assignment removed successfully",
  });
});

module.exports = { assignTask, unassignTask };
