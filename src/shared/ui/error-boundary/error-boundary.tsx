import { isApiError } from "@/shared/lib/error-type-fn";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode; // 정적 UI
	fallbackRender?: (error: Error, reset: () => void) => ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
	hasError: boolean;
	error: Error | null;
	errorType: string;
	errorMessage: string;
}

const classifyError = (error: unknown) => {
	if (!isApiError(error)) {
		return {
			type: "UNKNOWN",
			message: "알 수 없는 오류가 발생했습니다",
			canRetry: true,
		};
	}

	const status = error.response?.status;
	const code = error.response?.data?.code;
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

class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorType: "UNKNOWN",
			errorMessage: "알 수 없는 오류가 발생했습니다",
		};
	}

	static getDerivedStateFromError(error: Error): State {
		// 에러 분류
		const classified = classifyError(error);

		return {
			hasError: true,
			error,
			errorType: classified.type,
			errorMessage: classified.message,
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// 개발 환경에서 자세한 에러 정보 로깅
		if (process.env.NODE_ENV === "development") {
			console.error("Error Boundary caught an error:", {
				error,
				errorInfo,
				errorType: this.state.errorType,
			});
		}

		// 프로덕션 환경에서는 에러 추적 서비스로 전송
		// 예: Sentry, LogRocket 등
		if (process.env.NODE_ENV === "production") {
			// 여기에 에러 추적 서비스 호출
			// logErrorToService(error, errorInfo);
		}

		// 부모 컴포넌트의 에러 핸들러 호출
		this.props.onError?.(error, errorInfo);
	}

	handleReset = () => {
		this.setState({
			hasError: false,
			error: null,
			errorType: "UNKNOWN",
			errorMessage: "알 수 없는 오류가 발생했습니다",
		});
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			// 커스텀 fallback이 제공된 경우
			if (this.props.fallbackRender) {
				return this.props.fallbackRender(this.state.error!, this.handleReset);
			}

			// 기본 에러 UI
			return (
				<div className="min-h-[400px] flex flex-col items-center justify-center p-8">
					<div className="max-w-md w-full text-center">
						{/* 에러 아이콘 */}
						<div className="mb-4">
							{this.state.errorType === "NOT_FOUND" ? (
								<div className="text-6xl">🔍</div>
							) : this.state.errorType === "PERMISSION" ? (
								<div className="text-6xl">🔒</div>
							) : (
								<div className="text-6xl">⚠️</div>
							)}
						</div>

						{/* 에러 제목 */}
						<h2 className="text-2xl font-bold text-gray-700 mb-2">
							{this.state.errorType === "NOT_FOUND"
								? "페이지를 찾을 수 없습니다"
								: this.state.errorType === "PERMISSION"
									? "접근 권한이 없습니다"
									: "오류가 발생했습니다"}
						</h2>

						{/* 에러 메시지 */}
						<p className="text-gray-500 mb-6">{this.state.errorMessage}</p>

						{/* 액션 버튼 */}
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<button
								type="button"
								onClick={this.handleReset}
								className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
							>
								다시 시도
							</button>
							<button
								type="button"
								onClick={() => {
									window.location.href = "/";
								}}
								className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
							>
								홈으로 가기
							</button>
						</div>

						{/* 개발 환경에서 에러 스택 표시 */}
						{process.env.NODE_ENV === "development" && this.state.error && (
							<details className="mt-8 text-left">
								<summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
									개발자 정보 보기
								</summary>
								<pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
									{this.state.error.stack}
								</pre>
							</details>
						)}
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
