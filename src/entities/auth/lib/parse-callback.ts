import { type AuthCallbackParams, OAuthStatus } from "../model/types";
import { BanType } from "@/shared/api";
import { STORAGE_KEYS } from "@/shared/config/storage";

export const parseAuthCallbackParams = (): AuthCallbackParams => {
	try {
		const urlParams = new URLSearchParams(window.location.search);
		const state = urlParams.get("state");

		if (state) {
			try {
				const { csrfToken: receivedToken } = JSON.parse(atob(state));
				const storedToken = sessionStorage.getItem(STORAGE_KEYS.csrfToken);

				if (storedToken && receivedToken !== storedToken) {
					return {
						status: OAuthStatus.ERROR,
						error: "csrf_mismatch",
						message: "보안 검증에 실패했습니다.",
					};
				}

				if (storedToken) {
					sessionStorage.removeItem(STORAGE_KEYS.csrfToken);
				}
			} catch {
				return {
					status: OAuthStatus.ERROR,
					error: "invalid_state",
					message: "잘못된 요청입니다.",
				};
			}
		}

		const error = urlParams.get("error");

		// 1) 서버가 지정한 에러
		if (error) {
			return {
				status: OAuthStatus.ERROR,
				error: error,
				message: error,
			};
		}

		const status = urlParams.get("status");

		// status 유효성 검증
		if (
			!status ||
			!Object.values(OAuthStatus).includes(status as OAuthStatus)
		) {
			return {
				status: OAuthStatus.ERROR,
				error: "invalid_status",
				message: "잘못된 상태값입니다.",
			};
		}

		const validStatus = status as OAuthStatus;

		// 2) 회원가입이 필요한 경우
		if (validStatus === OAuthStatus.NEED_SIGNUP) {
			const puuid = urlParams.get("puuid");

			if (!puuid) {
				return {
					status: OAuthStatus.ERROR,
					error: "missing_puuid",
					message: "회원가입에 필요한 정보가 누락되었습니다.",
				};
			}

			return {
				status: OAuthStatus.NEED_SIGNUP,
				puuid,
			};
		}

		// 3) 로그인 성공
		if (validStatus === OAuthStatus.LOGIN_SUCCESS) {
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

			// 필수 데이터 누락 체크
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

		// 4) 예상치 못한 상태
		return {
			status: OAuthStatus.ERROR,
			error: "unexpected_status",
			message: `예상하지 못한 상태: ${validStatus}`,
		};
	} catch (error) {
		console.error("Failed to parse callback params:", error);
		return {
			status: OAuthStatus.ERROR,
			error: "parse_failed",
			message: "콜백 파라미터 파싱에 실패했습니다.",
		};
	}
};
