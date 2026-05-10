import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  authLogStudentWithGoogle,
  extractAuthErrorMessage,
} from "../api/authApi";

export const useSocialAuth = () => {
  const {
    mutateAsync: loginWithGoogleAsync,
    isPending,
    error,
    reset,
  } = useMutation({
    mutationFn: authLogStudentWithGoogle,
  });

  const loginWithGoogle = useCallback(
    async (idToken) => {
      reset();
      try {
        const response = await loginWithGoogleAsync(idToken);
        return response?.data ?? null;
      } catch {
        return null;
      }
    },
    [loginWithGoogleAsync, reset],
  );

  return {
    loading: isPending,
    error: error ? extractAuthErrorMessage(error) : null,
    loginWithGoogle,
  };
};
