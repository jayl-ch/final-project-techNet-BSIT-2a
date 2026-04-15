const taskAssignService = require("../services/task.assignment.service");

const assignTask = async (req, res) => {
  try {
    const assigned = await taskAssignService.assignTask(req.body, req.student);

    res.status(201).json({ assigned, message: "Task assigned successfuly" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = assignTask;
