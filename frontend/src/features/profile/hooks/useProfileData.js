import { useCallback, useEffect, useMemo, useState } from "react";
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

export const useProfileData = (onUnauthorized) => {
  const [profile, setProfile] = useState(null);
  const [formValues, setFormValues] = useState(createFormFromProfile(null));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUnauthorized = useCallback(() => {
    clearAuthToken();
    if (typeof onUnauthorized === "function") {
      onUnauthorized();
    }
  }, [onUnauthorized]);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAuthStudent();
      const student = response?.data?.student || null;

      setProfile(student);
      setFormValues(createFormFromProfile(student));
    } catch (err) {
      if (err?.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(extractAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

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

  const saveProfile = useCallback(async () => {
    setSaving(true);
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
      const response = await apiClient.patch("/api/student", payload);
      const updatedProfile = response?.data?.student || null;

      setProfile(updatedProfile);
      setFormValues(createFormFromProfile(updatedProfile));
      setSuccessMessage("Profile updated successfully.");
    } catch (err) {
      if (err?.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      setSaveError(extractAuthErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }, [formValues, handleUnauthorized]);

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
