import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api";
import { useAuthStore } from "@/shared/model/use-auth-store";

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
