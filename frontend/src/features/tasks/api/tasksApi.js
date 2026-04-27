import { apiClient } from "../../auth/api/authApi";

export const fetchTasks = async () => {
  const response = await apiClient.get("/api/task");
  const tasks = Array.isArray(response?.data?.tasks) ? response.data.tasks : [];
  return tasks;
};

export const createTask = async (taskPayload) => {
  const response = await apiClient.post("/api/task/create", taskPayload);
  return response?.data?.newTask;
};

export const updateTask = async (taskId, taskPayload) => {
  const response = await apiClient.patch(`/api/task/update/${taskId}`, taskPayload);
  return response?.data?.newTask;
};

export const deleteTask = async (taskId) => {
  await apiClient.delete(`/api/task/delete/${taskId}`);
};
