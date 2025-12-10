import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "@/shared/lib/toast";
import { useAuthStore } from "@/shared/model/use-auth-store";
import {
	isError,
	isLoginSuccess,
	isNeedSignup,
} from "@/entities/auth/model/guards";
import LoadingSpinner from "@/shared/ui/loading-spinner/loading-spinner";
import { parseAuthCallbackParams } from "@/entities/auth/lib/parse-callback";

export default function AuthCallback() {
	const login = useAuthStore((s) => s.login);

	const navigate = useNavigate();

	useEffect(() => {
		const response = parseAuthCallbackParams();

		if (!response) {
			throw new Error("예상치 못한 params입니다.");
		}

		if (isError(response)) {
			switch (response.error) {
				case "member_isBlind":
					toast.error("탈퇴한 사용자입니다.");
					break;
				case "signup_disabled":
					toast.error("롤과 연동되어 있지 않은 사용자입니다.");
					break;
				case "riot_api_error":
					toast.error("Riot 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
					break;
				default:
					toast.error(response.message || "에러가 발생했습니다.");
					break;
			}
			navigate({ from: "/riot/callback", to: "/riot" });
		} else if (isLoginSuccess(response)) {
			/** TODO: 저장할 값들이 더 있다면 여기서 저장하기 */
			login(response);
			navigate({ to: "/" });
		} else if (isNeedSignup(response)) {
			toast.error("회원가입 후 이용할 수 있습니다.");
			navigate({
				to: "/sign-up/terms",
				search: { puuid: response.puuid },
			});
		} else {
			throw new Error("잘못된 status입니다.");
		}

		return;
	}, []);

	return (
		<div className="flex h-full w-full items-center justify-center">
			<LoadingSpinner />
		</div>
	);
}
