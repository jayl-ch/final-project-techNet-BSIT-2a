import { useCallback, useState } from "react";
import { authRegStudent, extractAuthErrorMessage } from "../api/authApi";

export const useRegister = () => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const register = useCallback(async (credentials) => {
		setLoading(true);
		setError(null);

		try {
			const response = await authRegStudent(credentials);
			const payload = response?.data ?? null;
			setData(payload);
			return payload;
		} catch (err) {
			setError(extractAuthErrorMessage(err));
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	return { data, loading, error, register };
};
