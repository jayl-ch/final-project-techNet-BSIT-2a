const taskAssignService = require("../services/task.assignment.service");
const asyncHandler = require("../middlewares/async.handler");

const assignTask = asyncHandler(async (req, res) => {
  const assigned = await taskAssignService.assignTask(req.body, req.student);
  res.status(201).json({ assigned, message: "Task assigned successfuly" });
});

module.exports = assignTask;
