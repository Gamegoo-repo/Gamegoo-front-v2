import { QueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/shared/api";

// API 에러 타입 확인 헬퍼
const isApiError = (error: unknown): error is AxiosError<ApiErrorResponse> => {
	return (
		typeof error === "object" &&
		error !== null &&
		"isAxiosError" in error &&
		error.isAxiosError === true
	);
};

// 에러 분류 헬퍼
const classifyError = (error: unknown) => {
	if (!isApiError(error)) {
		return {
			type: "UNKNOWN",
			message: "알 수 없는 오류가 발생했습니다",
			canRetry: true,
		};
	}

	const status = error.response?.status;
	// const code = error.response?.data?.code;
	const errorMessage = error.response?.data?.message;

	// 401: 인증 오류 - 재시도 불가
	if (status === 401) {
		return {
			type: "AUTH",
			message: "로그인이 필요합니다",
			canRetry: false,
		};
	}

	// 403: 권한 오류 - 재시도 불가
	if (status === 403) {
		return {
			type: "PERMISSION",
			message: "접근 권한이 없습니다",
			canRetry: false,
		};
	}

	// 404: 리소스 없음 - 재시도 불가
	if (status === 404) {
		return {
			type: "NOT_FOUND",
			message: "요청한 정보를 찾을 수 없습니다",
			canRetry: false,
		};
	}

	// 422: 검증 오류 - 재시도 불가
	if (status === 422) {
		return {
			type: "VALIDATION",
			message: errorMessage || "입력값을 확인해주세요",
			canRetry: false,
		};
	}

	// 429: Rate Limit - 재시도 가능
	if (status === 429) {
		return {
			type: "RATE_LIMIT",
			message: "너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요",
			canRetry: true,
			retryAfter: error.response?.headers?.["retry-after"],
		};
	}

	// 500번대: 서버 오류 - 재시도 가능
	if (status && status >= 500) {
		return {
			type: "SERVER",
			message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요",
			canRetry: true,
		};
	}

	// 네트워크 오류 - 재시도 가능
	if (error.code === "ERR_NETWORK") {
		return {
			type: "NETWORK",
			message: "네트워크 연결을 확인해주세요",
			canRetry: true,
		};
	}

	// 타임아웃 - 재시도 가능
	if (error.code === "ECONNABORTED") {
		return {
			type: "TIMEOUT",
			message: "요청 시간이 초과되었습니다",
			canRetry: true,
		};
	}

	// 기본값
	return {
		type: "UNKNOWN",
		message: errorMessage || error.message || "오류가 발생했습니다",
		canRetry: true,
	};
};

// 글로벌 에러 핸들러
const handleError = (error: unknown) => {
	const classifiedError = classifyError(error);

	if (process.env.NODE_ENV === "development") {
		console.error("Query Error:", {
			error,
			classification: classifiedError,
		});
	}

	switch (classifiedError.type) {
		case "AUTH":
			// 로그인 페이지로 리다이렉트
			if (window.location.pathname !== "/riot") {
				sessionStorage.setItem("redirectAfterLogin", window.location.href);
				window.location.href = "/riot";
			}
			break;
		case "PERMISSION":
		case "NOT_FOUND":
			// Error Boundary로 전파
			throw error;
		case "NETWORK":
		case "TIMEOUT":
		case "SERVER":
			// 네트워크/서버 오류는 사용자에게 알림
			// TODO - Toast 시스템 호출 코드 추가
			console.warn(classifiedError.message);
			break;

		default:
			// 기타 오류
			console.error(classifiedError.message);
	}
};

// QueryClient 인스턴스 생성
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: (failureCount, error) => {
				if (failureCount >= 3) return false;

				const classified = classifyError(error);
				return classified.canRetry;
			},

			// 지수 백오프 - 재시도 사이의 간격을 점차 늘리기
			retryDelay: (attemptIndex, error) => {
				const classified = classifyError(error);

				if (classified.type === "RATE_LIMIT" && classified.retryAfter) {
					return Number.parseInt(classified.retryAfter, 10) * 1000;
				}

				return Math.min(1000 * 2 ** attemptIndex, 30000);
			},

			staleTime: 1000 * 60,
			gcTime: 1000 * 60 * 5,
			refetchOnWindowFocus: false,
			refetchOnMount: true,
			refetchOnReconnect: "always",

			throwOnError: (error) => {
				const classified = classifyError(error);

				return ["PERMISSION", "NOT_FOUND"].includes(classified.type);
			},
		},

		mutations: {
			retry: false,

			onError: (error) => {
				handleError(error);
			},
		},
	},
});

// 타입 export
export type { ApiErrorResponse };
export { classifyError, isApiError };
