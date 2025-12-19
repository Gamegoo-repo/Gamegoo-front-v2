import { useQuery } from "@tanstack/react-query";
import { api, tokenManager } from "@/shared/api";

export const useDevSignUp = () => {
	const query = useQuery({
		queryKey: ["sign-in"],
		queryFn: async () => {
			const response = await api.public.home.getTestAccessToken(2);
			// 토큰 자동 저장
			if (response.data?.data) {
				tokenManager.setTokens(
					response.data.data.accessToken,
					response.data.data.refreshToken,
				);
			}
			return response.data?.data;
		},
		enabled: false, // 자동 실행 방지
	});

	return {
		...query,
		signUp: query.refetch,
	};
};
