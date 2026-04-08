import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { trackRollBtiEvent } from "@/features/lol-bti/test/api";
import type { LolBtiResultType } from "@/features/lol-bti/test/config";
import {
	type ApiErrorResponse,
	api,
	type BanType,
	type RiotJoinRequest,
} from "@/shared/api";
import type { RiotJoinResponse } from "@/shared/api/@generated/models/riot-join-response";
import { isValidApiError } from "@/shared/api/guard";
import { getEventSource } from "@/shared/lib/get-device";
import { SessionManager } from "@/shared/lib/session/session-manager";
import { toast } from "@/shared/lib/toast";
import { useAuthStore } from "@/shared/model/use-auth-store";

/** 롤BTI 세션이 존재하면 가입 완료 이벤트를 전송하고 세션을 초기화 */
const trackLolBtiSignupIfNeeded = () => {
	const sessionId = SessionManager.peek();
	if (sessionId === null) {
		return;
	}

	const rollBtiType = SessionManager.getResultType() as LolBtiResultType | null;
	if (rollBtiType !== null) {
		trackRollBtiEvent({
			eventType: "SIGNUP_COMPLETE",
			sessionId,
			rollBtiType,
			eventSource: getEventSource(),
		});
	}

	SessionManager.clearAll();
};

export const useSignUpMutation = () => {
	const auth = useAuthStore();
	const navigate = useNavigate();

	/** 로그인 처리 로직 */
	const handleLoginSuccess = (data: RiotJoinResponse) => {
		auth.login({
			accessToken: data.accessToken || "",
			refreshToken: data.refreshToken || "",
			id: String(data.id),
			name: data.name || "",
			tag: data.tag || "",
			profileImage: String(data.profileImage),
			status: "LOGIN_SUCCESS",
			banType: "NONE" as BanType,
			banExpireAt: "",
			isBanned: false,
		});
	};

	return useMutation({
		mutationFn: async (request: RiotJoinRequest) => {
			const response = await api.public.riot.joinByRSO(request);
			const data = response.data.data as RiotJoinResponse;

			if (
				!data ||
				!data.accessToken ||
				!data.refreshToken ||
				!data.id ||
				!data.name ||
				!data.tag
			) {
				throw new Error("Invalid signup response: missing required fields");
			}

			return data;
		},
		onSuccess: (data) => {
			handleLoginSuccess(data);
			trackLolBtiSignupIfNeeded();
			navigate({ to: "/" });
		},
		onError: (error: AxiosError<ApiErrorResponse>) => {
			const errorData = error.response?.data;

			if (!isValidApiError(errorData)) {
				toast.error("알 수 없는 오류가 발생했습니다.");
				return;
			}

			if (errorData?.status >= 400 && errorData.status < 500) {
				toast.error(errorData.message);
				navigate({ to: "/riot" });
			}
		},
	});
};
