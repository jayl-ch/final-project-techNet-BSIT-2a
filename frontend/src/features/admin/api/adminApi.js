import { apiClient } from "../../auth/api/authApi";

export const fetchAdminUsers = async () => {
  const response = await apiClient.get("/api/admin/users");
  return response?.data?.users ?? [];
};
