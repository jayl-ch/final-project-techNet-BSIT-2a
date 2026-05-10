import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { authLogStudent, extractAuthErrorMessage } from "../api/authApi";

export const useLogin = () => {
	const {
		mutateAsync: loginAsync,
		isPending,
		error,
		data,
		reset,
	} = useMutation({
		mutationFn: authLogStudent,
	});

	const login = useCallback(
		async (credentials) => {
			reset();
			try {
				const response = await loginAsync(credentials);
				return response?.data ?? null;
			} catch {
				return null;
			}
		},
		[loginAsync, reset],
	);

	return {
		data: data?.data ?? null,
		loading: isPending,
		error: error ? extractAuthErrorMessage(error) : null,
		login,
	};
};
