import { useCallback, useState } from "react";
import {
  authLogStudentWithGoogle,
  extractAuthErrorMessage,
} from "../api/authApi";

export const useSocialAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginWithGoogle = useCallback(async (idToken) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authLogStudentWithGoogle(idToken);
      return response?.data ?? null;
    } catch (err) {
      setError(extractAuthErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, loginWithGoogle };
};
