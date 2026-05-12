import { useCallback, useMemo } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  authLogoutStudent,
  clearAuthToken,
  getAuthStudent,
} from "../../auth/api/authApi";

const baseNavItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "house-door",
  },
  {
    name: "Tasks",
    path: "/tasks",
    icon: "check2-square",
  },
  {
    name: "Groups",
    path: "/groups",
    icon: "people",
  },
  {
    name: "Profile",
    path: "/profile",
    icon: "person",
  },
];

const isUnauthorizedError = (error) =>
  axios.isAxiosError(error) && error.response?.status === 401;

export const useSidebarData = () => {
  const studentQuery = useQuery({
    queryKey: ["student"],
    queryFn: async () => {
      const response = await getAuthStudent();
      return response?.data?.student ?? null;
    },
    staleTime: 30000,
    retry: (failureCount, error) =>
      !isUnauthorizedError(error) && failureCount < 1,
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        clearAuthToken();
      }
    },
  });

  const isDeveloper = studentQuery.data?.role === "developer";

  const navItems = useMemo(() => {
    if (!isDeveloper) {
      return baseNavItems;
    }

    return [
      ...baseNavItems,
      {
        name: "Admin",
        path: "/admin",
        icon: "shield-lock",
      },
    ];
  }, [isDeveloper]);

  const handleLogout = useCallback(async () => {
    await authLogoutStudent();
  }, []);

  return { navItems, handleLogout, isDeveloper };
};
