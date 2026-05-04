import { apiClient } from "../../auth/api/authApi";

export const fetchGroups = async () => {
  const response = await apiClient.get("/api/group");
  const groups = Array.isArray(response?.data?.groups) ? response.data.groups : [];
  return groups;
};

export const createGroup = async (payload) => {
  const response = await apiClient.post("/api/group/create", payload);
  return response?.data?.newGroup ?? response?.data?.group ?? null;
};

export const joinGroup = async (payload) => {
  const response = await apiClient.post("/api/group/join", payload);
  return response?.data?.member ?? response?.data?.group ?? null;
};

export const removeGroup = async (groupId) => {
  await apiClient.delete(`/api/group/delete/${groupId}`);
};

export const removeGroupMember = async (groupId, memberId) => {
  await apiClient.delete(`/api/group/${groupId}/member/${memberId}`);
};

export const leaveGroup = async (groupId) => {
  await apiClient.delete(`/api/group/${groupId}/leave`);
};

export const fetchGroupDetails = async (groupId) => {
  const response = await apiClient.get(`/api/group/${groupId}/details`);

  return {
    group: response?.data?.group ?? null,
    members: Array.isArray(response?.data?.members) ? response.data.members : [],
  };
};

export const fetchAssignableTasks = async () => {
  const response = await apiClient.get("/api/task");
  return Array.isArray(response?.data?.tasks) ? response.data.tasks : [];
};

export const assignTaskToMember = async ({ taskId, assignedTo, groupId }) => {
  const response = await apiClient.post("/api/task/assign", {
    taskId,
    assignedTo,
    groupId,
  });

  return response?.data?.assigned ?? null;
};

export const updateAssignedTaskStatus = async (taskId, status) => {
  const response = await apiClient.patch(`/api/task/update/${taskId}`, { status });
  return response?.data?.newTask;
};
