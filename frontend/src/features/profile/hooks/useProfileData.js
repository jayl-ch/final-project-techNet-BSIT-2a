import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiClient,
  clearAuthToken,
  extractAuthErrorMessage,
  getAuthStudent,
} from "../../auth/api/authApi";

const createFormFromProfile = (profile) => ({
  name: profile?.name || "",
  email: profile?.email || "",
  currentPassword: "",
  newPassword: "",
});

const isUnauthorizedError = (error) =>
  axios.isAxiosError(error) && error.response?.status === 401;

export const useProfileData = (onUnauthorized) => {
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState(createFormFromProfile(null));
  const [saveError, setSaveError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUnauthorized = useCallback(() => {
    clearAuthToken();
    if (typeof onUnauthorized === "function") {
      onUnauthorized();
    }
  }, [onUnauthorized]);

  const profileQuery = useQuery({
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
        handleUnauthorized();
      }
    },
  });

  const profile = profileQuery.data ?? null;
  const loading = profileQuery.isLoading;
  const error =
    profileQuery.error && !isUnauthorizedError(profileQuery.error)
      ? extractAuthErrorMessage(profileQuery.error)
      : "";

  useEffect(() => {
    setFormValues(createFormFromProfile(profile));
  }, [profile]);

  const completion = useMemo(() => {
    if (!profile) {
      return 0;
    }

    const checks = [Boolean(profile.name?.trim()), Boolean(profile.email?.trim())];
    const doneCount = checks.filter(Boolean).length;

    return Math.round((doneCount / checks.length) * 100);
  }, [profile]);

  const updateField = useCallback((event) => {
    const { name, value } = event.target;

    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
    setSuccessMessage("");
    setSaveError("");
  }, []);

  const resetForm = useCallback(() => {
    setFormValues(createFormFromProfile(profile));
    setSaveError("");
    setSuccessMessage("");
  }, [profile]);

  const { mutateAsync: saveProfileAsync, isPending: saving } = useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.patch("/api/student", payload);
      return response?.data?.student ?? null;
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["student"], updatedProfile);
      setFormValues(createFormFromProfile(updatedProfile));
      setSuccessMessage("Profile updated successfully.");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
      }
    },
  });

  const saveProfile = useCallback(async () => {
    setSaveError("");
    setSuccessMessage("");

    const payload = {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
    };

    if (formValues.newPassword.trim()) {
      payload.currentPassword = formValues.currentPassword;
      payload.newPassword = formValues.newPassword;
    }

    try {
      await saveProfileAsync(payload);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        handleUnauthorized();
        return;
      }

      setSaveError(extractAuthErrorMessage(err));
    }
  }, [formValues, handleUnauthorized, saveProfileAsync]);

  return {
    profile,
    formValues,
    loading,
    saving,
    error,
    saveError,
    successMessage,
    completion,
    updateField,
    resetForm,
    saveProfile,
  };
};
