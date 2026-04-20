const { setPriorityLevel } = require("../services/task.priority.service");

const setPriority = async (req, res) => {
  const { id } = req.student;
  const taskId = req.params.id;

  try {
    const priorityRecord = await setPriorityLevel(taskId, id);

    res.status(201).json({ priorityLevel: priorityRecord.priorityLevel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { setPriority };
