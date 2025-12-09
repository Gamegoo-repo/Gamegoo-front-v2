import { BanType } from "@/shared/api";
import { type AuthCallbackParams, OAuthStatus } from "./dto";
import { STORAGE_KEYS } from "@/shared/config/storage";

export const parseAuthCallbackParams = (): AuthCallbackParams | null => {
	try {
		const urlParams = new URLSearchParams(window.location.search);
		const state = urlParams.get("state");

		if (state) {
			try {
				const { csrfToken: receivedToken } = JSON.parse(atob(state));
				const storedToken = sessionStorage.getItem(STORAGE_KEYS.csrfToken);

				if (receivedToken !== storedToken) {
					return {
						status: OAuthStatus.ERROR,
						error: "csrf_mismatch",
						message: "보안 검증에 실패했습니다.",
					};
				}

				sessionStorage.removeItem(STORAGE_KEYS.csrfToken);
			} catch {
				return {
					status: OAuthStatus.ERROR,
					error: "invalid_state",
					message: "잘못된 요청입니다.",
				};
			}
		}

		const error = urlParams.get("error");

		// 1) 서버가 지정한 에러인 경우
		if (error) {
			return {
				status: OAuthStatus.ERROR,
				error: error,
				message: error,
			};
		}

		// status 유효성 검증
		const status = urlParams.get("status") as OAuthStatus;

		if (!status || !Object.values(OAuthStatus).includes(status)) {
			return {
				status: OAuthStatus.ERROR,
				error: "invalid_status",
				message: "잘못된 상태값입니다.",
			};
		}

		// 2) 회원가입이 필요한 경우
		if (status === OAuthStatus.NEED_SIGNUP) {
			const puuid = urlParams.get("puuid");

			// 2-1) puuid가 없는 경우 - 에러
			if (!puuid) {
				return {
					status: OAuthStatus.ERROR,
					error: "missing_puuid",
					message: "회원가입에 필요한 정보가 누락되었습니다.",
				};
			}

			// 2-2) 있는 경우 - NEED_SIGNUP
			return {
				status: OAuthStatus.NEED_SIGNUP,
				puuid,
			};
		}

		// 3) 로그인에 성공한 경우
		if (status === OAuthStatus.LOGIN_SUCCESS) {
			const accessToken = urlParams.get("accessToken");
			const refreshToken = urlParams.get("refreshToken");
			const name = urlParams.get("name");
			const tag = urlParams.get("tag");
			const profileImage = urlParams.get("profileImage");
			const id = urlParams.get("id");
			const banType = urlParams.get("BanType");
			const banExpireAt = urlParams.get("BanExpireAt");
			const isBanned = urlParams.get("isBanned");
			const banMessage = urlParams.get("BanMessage");

			// 3-1) 성공했다는 응답을 받았지만, 필수 데이터가 누락된 경우 - 에러 처리
			if (
				!accessToken ||
				!refreshToken ||
				!name ||
				!tag ||
				!profileImage ||
				!id
			) {
				return {
					status: OAuthStatus.ERROR,
					error: "missing_required_fields",
					message: "로그인 응답에 필수 필드가 누락되었습니다.",
				};
			}

			// 3-2) 성공했다는 응답을 받았고, 모든 데이터를 잘 받은 경우 - 로그인 성공
			return {
				status: OAuthStatus.LOGIN_SUCCESS,
				accessToken,
				refreshToken,
				name: decodeURIComponent(name),
				tag,
				profileImage,
				id,
				banType: (banType as BanType) || BanType.NONE,
				banExpireAt: banExpireAt || "",
				isBanned: isBanned === "true",
				banMessage: banMessage || undefined,
			};
		}

		// 4) 예상치 못한 상태 - 에러 처리
		return {
			status: OAuthStatus.ERROR,
			error: "unexpected_status",
			message: `예상하지 못한 상태: ${status}`,
		};
	} catch (error) {
		console.error("Failed to parse callback params:", error);
		return null;
	}
};
