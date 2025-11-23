import { api } from "@/shared/api";
import { tokenManager } from "@/shared/api/config";

/**
 * 테스트용 로그인 함수
 * memberId를 사용하여 테스트 access token을 받아옵니다
 */
export const testLogin = async (memberId: number = 2) => {
	if (process.env.NODE_ENV !== "development") {
		return false;
	}

	try {
		const response = await api.public.home.getTestAccessToken(memberId);

		// API 응답에서 토큰 추출
		const token = response.data.data;

		if (token) {
			// 토큰을 저장
			tokenManager.setTokens(token);
			return true;
		}

		return false;
	} catch (error) {
		console.error("Test login failed:", error);
		return false;
	}
};

/**
 * 개발 환경에서 자동 테스트 로그인
 */
export const autoTestLogin = async () => {
	if (process.env.NODE_ENV !== "development") {
		return;
	}

	const existingToken = tokenManager.getAccessToken();
	if (existingToken) {
		return;
	}

	// 자동으로 memberId 2번으로 로그인
	await testLogin(2);
};

/**
 * 브라우저 콘솔에서 사용할 수 있는 테스트 로그인 헬퍼
 * 사용법: window.testLogin(2) 또는 window.testLogin(원하는_memberId)
 */
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
	(window as any).testLogin = async (memberId: number = 2) => {
		const success = await testLogin(memberId);
		if (success) {
			console.log(`✅ Test login successful with memberId: ${memberId}`);
		} else {
			console.error(`❌ Test login failed with memberId: ${memberId}`);
		}
		return success;
	};

	console.log(
		"%c🔧 Development Mode Test Login",
		"background: #5A42EE; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;",
	);
	console.log(
		"%cUse window.testLogin(memberId) to login with test token",
		"color: #5A42EE; font-weight: bold;",
	);
	console.log("Examples:");
	console.log("  window.testLogin(2) - Login as member ID 2");
}
