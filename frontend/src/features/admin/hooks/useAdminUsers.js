import { useCallback } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { clearAuthToken, extractAuthErrorMessage } from "../../auth/api/authApi";
import { fetchAdminUsers } from "../api/adminApi";

const isUnauthorizedError = (error) =>
  axios.isAxiosError(error) && error.response?.status === 401;

const isForbiddenError = (error) =>
  axios.isAxiosError(error) && error.response?.status === 403;

export const useAdminUsers = (onUnauthorized, onForbidden) => {
  const handleUnauthorized = useCallback(() => {
    clearAuthToken();
    onUnauthorized?.();
  }, [onUnauthorized]);

  const handleForbidden = useCallback(() => {
    onForbidden?.();
  }, [onForbidden]);

  const usersQuery = useQuery({
    queryKey: ["adminUsers"],
    queryFn: fetchAdminUsers,
    staleTime: 30000,
    retry: (failureCount, error) =>
      !isUnauthorizedError(error) &&
      !isForbiddenError(error) &&
      failureCount < 1,
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
      } else if (isForbiddenError(error)) {
        handleForbidden();
      }
    },
  });

  const users = Array.isArray(usersQuery.data) ? usersQuery.data : [];
  const loading = usersQuery.isLoading;
  const error =
    usersQuery.error &&
    !isUnauthorizedError(usersQuery.error) &&
    !isForbiddenError(usersQuery.error)
      ? extractAuthErrorMessage(usersQuery.error)
      : "";

  return { users, loading, error, refetch: usersQuery.refetch };
};
