import { useMutation } from "@tanstack/react-query";
import type { RefreshTokenRequest } from "@/shared/api/@generated";
import { AuthControllerApi } from "@/shared/api/@generated";
import { tokenManager } from "@/shared/api/config";

const authApi = new AuthControllerApi();

export const useRefreshToken = () => {
	return useMutation({
		mutationFn: async (refreshToken: string) => {
			const request: RefreshTokenRequest = { refreshToken };
			const response = await authApi.updateToken(request);
			return response.data;
		},
		onSuccess: (data) => {
			if (data?.data?.accessToken && data?.data?.refreshToken) {
				tokenManager.setTokens(data.data.accessToken, data.data.refreshToken);
			}
		},
		onError: (error) => {
			console.warn("Token refresh failed:", error);
		},
	});
};
