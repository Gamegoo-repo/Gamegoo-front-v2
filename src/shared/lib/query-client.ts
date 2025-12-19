import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import type { ApiErrorResponse } from "@/shared/api";
import { useAppErrorStore } from "../ui/error-boundary/app-error-store";
import { isApiError, isAuthError, isServerError } from "./error-type-fn";

type ErrorHandlingStrategy = "toast" | "errorBoundary" | "ignore";

export type WithErrorHandlingStrategy<P = unknown> = P & {
	errorHandlingStrategy?: ErrorHandlingStrategy;
};

const classifyError = (error: unknown) => {
	if (!isApiError(error)) {
		return {
			type: "UNKNOWN",
			message: "알 수 없는 오류가 발생했습니다",
			canRetry: true,
		};
	}

	const status = error.response?.status;
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

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// 재시도 로직
			retry: (failureCount, error) => {
				if (failureCount >= 3) return false;

				// 에러 분류에 따라 재시도 여부 결정
				const classified = classifyError(error);
				return classified.canRetry;
			},

			// 지수 백오프
			retryDelay: (attemptIndex) => {
				return Math.min(1000 * 2 ** attemptIndex, 30000);
			},

			staleTime: 1000 * 60,
			gcTime: 1000 * 60 * 5,
			refetchOnWindowFocus: false,
			refetchOnMount: true,
			refetchOnReconnect: "always",

			// 모든 에러를 Error Boundary로 전파
			throwOnError: true,
		},

		mutations: {
			// mutation 재시도는 기본적으로 비활성화
			retry: false,
			// throwOnError: true,
		},
	},
	queryCache: new QueryCache({
		onError: (error: Error, query) => {
			// 개발 환경 로깅
			if (process.env.NODE_ENV === "development") {
				console.error("Query Error:", {
					queryKey: query.queryKey,
					error,
					isRequestError: isApiError(error),
				});
			}

			if ((error as any)?.silent) {
				return;
			}

			// AxiosError인 경우만 처리
			if (!isApiError(error)) {
				// 일반 에러는 Error Boundary로 전파
				throw error;
			}

			// AUTH 에러 자동 처리
			if (isAuthError(error)) {
				// if (window.location.pathname !== "/riot") {
				// 	sessionStorage.setItem("redirectAfterLogin", window.location.href);
				// 	window.location.href = "/riot";
				// }
				return;
			}

			// 서버 에러도 에러 바운더리로 전파
			if (isServerError(error)) {
				throw error;
			}

			// 예측 가능한 에러는 app-error-store에 저장 (ErrorCatcher에서 처리)
			useAppErrorStore.setState({ appError: error });
		},
	}),
	mutationCache: new MutationCache({
		onError: (error: Error) => {
			if (!isApiError(error)) {
				throw error;
			}

			if (isAuthError(error)) {
				// if (window.location.pathname !== "/riot") {
				// 	sessionStorage.setItem("redirectAfterLogin", window.location.href);
				// 	window.location.href = "/riot";
				// }
				return; // 토스트 안 띄움
			}

			// const errorMessage =
			// 	error.response?.data.message || "오류가 발생했습니다.";

			// toast.error(errorMessage);

			useAppErrorStore.setState({ appError: error });
		},
	}),
});

export type { ApiErrorResponse };
