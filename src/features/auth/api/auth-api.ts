import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/entities/auth";
import { api } from "@/shared/api";

export const useRefreshToken = () => {
	const login = useAuthStore((s) => s.login);
	return useMutation({
		mutationFn: async (refreshToken: string) => {
			const response = await api.private.auth.updateToken({ refreshToken });
			return response.data;
		},
		onSuccess: (data) => {
			if (data?.data?.accessToken && data?.data?.refreshToken) {
				const { accessToken, refreshToken } = data.data;
				login({ accessToken, refreshToken });
			}
		},
	});
};
