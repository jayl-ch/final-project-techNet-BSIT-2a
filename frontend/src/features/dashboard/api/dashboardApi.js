import { apiClient } from "../../auth/api/authApi";

export const updateTaskStatus = async (taskId, status) => {
  return apiClient.patch(`/api/task/update/${taskId}`, { status });
};

export const fetchDashboardData = async () => {
  const [studentResult, tasksResult] = await Promise.allSettled([
    apiClient.get("/api/student"),
    apiClient.get("/api/task"),
  ]);

  if (tasksResult.status === "rejected") {
    throw tasksResult.reason;
  }

  const student =
    studentResult.status === "fulfilled"
      ? studentResult.value?.data?.student ?? null
      : null;

  const tasks =
    tasksResult.value?.data?.tasks && Array.isArray(tasksResult.value.data.tasks)
      ? tasksResult.value.data.tasks
      : [];

  return {
    student,
    tasks,
  };
};