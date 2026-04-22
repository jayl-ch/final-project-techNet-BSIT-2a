const { setPriorityLevel } = require("../services/task.priority.service");
const asyncHandler = require("../middlewares/async.handler");

const setPriority = asyncHandler(async (req, res) => {
  const { id } = req.student;
  const taskId = req.params.id;

  const priorityRecord = await setPriorityLevel(taskId, id);

  res.status(201).json({ priorityLevel: priorityRecord.priorityLevel });
});

module.exports = { setPriority };
