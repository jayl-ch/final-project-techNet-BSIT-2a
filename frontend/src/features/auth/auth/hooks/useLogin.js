import { useCallback, useState } from "react";
import {
	authLogStudent,
	extractAuthErrorMessage,
} from "../api/authApi";

export const useLogin = () => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const login = useCallback(async (credentials) => {
		setLoading(true);
		setError(null);

		try {
			const response = await authLogStudent(credentials);
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

	return { data, loading, error, login };
};
