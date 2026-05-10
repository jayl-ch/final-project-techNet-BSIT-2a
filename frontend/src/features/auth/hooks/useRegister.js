import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { authRegStudent, extractAuthErrorMessage } from "../api/authApi";

export const useRegister = () => {
	const {
		mutateAsync: registerAsync,
		isPending,
		error,
		data,
		reset,
	} = useMutation({
		mutationFn: authRegStudent,
	});

	const register = useCallback(
		async (credentials) => {
			reset();
			try {
				const response = await registerAsync(credentials);
				return response?.data ?? null;
			} catch {
				return null;
			}
		},
		[registerAsync, reset],
	);

	return {
		data: data?.data ?? null,
		loading: isPending,
		error: error ? extractAuthErrorMessage(error) : null,
		register,
	};
};
