import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { isError, isLoginSuccess, isNeedSignup } from "@/features/auth";
import { parseAuthCallbackParams } from "@/features/auth/api/mappers";
import { useAuthStore } from "@/shared/model/use-auth-store";

export default function AuthCallback() {
	const login = useAuthStore((s) => s.login);

	const navigate = useNavigate();

	useEffect(() => {
		const response = parseAuthCallbackParams();

		if (!response) {
			throw new Error("예상치 못한 params입니다.");
		}

		if (isError(response)) {
			navigate({ from: "/riot/callback", to: "/riot" });
		} else if (isLoginSuccess(response)) {
			/** TODO: 저장할 값들이 더 있다면 여기서 저장하기 */
			login(response);
			navigate({
				to: "/",
			});
		} else if (isNeedSignup(response)) {
			navigate({
				to: "/sign-up/terms",
				search: { puuid: response.puuid },
			});
		} else {
			throw new Error("잘못된 status입니다.");
		}

		return;
	}, [navigate]);

	return <div>처리중...</div>;
}
