const {
  create,
  findByCreator,
  findByIdAndCreator,
  findById,
  updateById,
  deleteById,
} = require("../repositories/task.repo");
const { existsByTaskAndUser, findAssignedTasksByStudent } = require("../repositories/task.assignment.repo");
const { syncTaskPriorities } = require("./task.priority.service");
const {
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} = require("../utils/errors");

const getTasksByCreator = async (id) => {
  const createdTasks = await findByCreator(id);
  const assignments = await findAssignedTasksByStudent(id);
  
  const assignedTasks = assignments
    .map(a => a.taskId)
    .filter(t => t != null);
    
  // Merge and deduplicate by _id
  const taskMap = new Map();
  [...createdTasks, ...assignedTasks].forEach(t => {
    if(t && t._id) taskMap.set(t._id.toString(), t);
  });
  
  const tasks = Array.from(taskMap.values()).sort((a, b) => {
    const dateA = a.deadline ? new Date(a.deadline) : new Date(0);
    const dateB = b.deadline ? new Date(b.deadline) : new Date(0);
    return dateA - dateB;
  });

  const priorityByTaskId = await syncTaskPriorities(tasks);

  return tasks.map((task) => {
    const taskData =
      typeof task.toObject === "function" ? task.toObject() : task;

    return {
      ...taskData,
      priorityLevel: priorityByTaskId[String(taskData._id)] || "LOW",
    };
  });
};

const createTask = async (task, id) => {
  if (!task?.name || !task?.deadline) {
    throw new BadRequestError("Task name and deadline are required");
  }

  return await create(task, id);
};

const updateTask = async (taskId, studentId, taskInfo) => {
  const allowedFields = ["name", "difficulty", "deadline", "subject", "status"];
  const task = {};

  const existingTask = await findById(taskId);
  if (!existingTask) throw new NotFoundError("Task not found");

  const isCreator = existingTask.creator.toString() === studentId.toString();
  let isAssigned = false;

  if (!isCreator) {
    isAssigned = await existsByTaskAndUser(taskId, studentId);
    if (!isAssigned) throw new ForbiddenError("Unauthorized");
  }

  for (let key of allowedFields) {
    if (taskInfo[key] !== undefined) {
      if (!isCreator && key !== "status") {
        throw new ForbiddenError("Assigned members can only update task status");
      }
      task[key] = taskInfo[key];
    }
  }

  const newTask = await updateById(taskId, task);

  if (!newTask) {
    throw new NotFoundError("Task not found");
  }

  return newTask;
};

const deleteTask = async (taskId, studentId) => {
  const task = await findByIdAndCreator(taskId, studentId);
  if (!task) throw new ForbiddenError("Unauthorized");

  await deleteById(taskId);
  return task;
};

module.exports = { getTasksByCreator, createTask, updateTask, deleteTask };
