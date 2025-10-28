import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type {
	RefreshTokenRequest,
	RiotJoinRequest,
} from "@/shared/api/@generated";
import { AuthControllerApi, RiotApi } from "@/shared/api/@generated";
import { tokenManager } from "@/shared/api/config";
import { api } from "@/shared/api";

const authApi = new AuthControllerApi();

export const useRefreshToken = () => {
	return useMutation({
		mutationFn: async (refreshToken: string) => {
			const request: RefreshTokenRequest = { refreshToken };
			const response = await api.private.auth.updateToken(request);
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

export const useSignUpMutation = () => {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async (riotJoinRequestDto: RiotJoinRequest) => {
			const response = await api.public.riot.joinByRSO(riotJoinRequestDto);
			return response.data.data;
		},
		onSuccess: (data) => {
			if (data) {
				// const { accessToken, refreshToken } = data;
				// if (accessToken && refreshToken) {
				// 	tokenManager.setTokens(accessToken, refreshToken);
				// 	navigate({
				// 		to: "/",
				// 	});
				// }
			}
		},
		onError: (error) => {
			console.warn("Token refresh failed:", error);
			switch (error.name) {
				case "MEMBER_403":
					console.log("이미 존재하는 사용자입니다.");
					return;
				case "RIOT_402":
					console.log("해당 Riot 계정이 존재하지 않습니다.");
					return;
				case "RIOT_401":
					console.log("잘못된 Riot API 키입니다.");
					return;
			}
		},
	});
};
