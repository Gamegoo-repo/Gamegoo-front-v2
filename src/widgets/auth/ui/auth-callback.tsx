import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { OAuthStatus } from "@/features/auth";
import { parseAuthCallbackParams } from "@/features/auth/api/mappers";
import { tokenManager } from "@/shared/api";

export default function AuthCallback() {
	const navigate = useNavigate();
	useEffect(() => {
		const response = parseAuthCallbackParams();

		if (!response) {
			throw new Error("예상치 못한 params입니다.");
		}

		const { status, accessToken, refreshToken, puuid } = response;

		if (status === OAuthStatus.ERROR) {
			navigate({ from: "/riot/callback", to: "/riot" });
		} else if (status === OAuthStatus.LOGIN_SUCCESS) {
			if (accessToken && refreshToken) {
				tokenManager.setTokens(accessToken, refreshToken);
				navigate({
					to: "/",
				});
			} else {
				throw new Error("토큰이 존재하지 않습니다.");
			}
		} else if (status === OAuthStatus.NEED_SIGNUP) {
			navigate({
				to: "/sign-up/terms",
				search: { puuid: puuid ?? "" },
			});
		} else {
			throw new Error("잘못된 status입니다.");
		}

		return;
	}, [navigate]);

	return <div>처리중...</div>;
}
