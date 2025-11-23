import { Component, type ErrorInfo, type ReactNode } from "react";
import { classifyError, isApiError } from "@/shared/lib/query-client";

interface Props {
	children: ReactNode;
	fallback?: (error: Error, reset: () => void) => ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
	keepChildrenOnError?: boolean;
}

interface State {
	hasError: boolean;
	error: Error | null;
	errorType: string;
	errorMessage: string;
}

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
		if (process.env.NODE_ENV === "development") {
			console.error("Error Boundary caught an error:", {
				error,
				errorInfo,
				errorType: this.state.errorType,
			});
		}

		if (process.env.NODE_ENV === "production") {
		}

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
			// 커스텀 fallback이 제공된 경우
			if (this.props.fallback) {
				return this.props.fallback(this.state.error!, this.handleReset);
			}

			// 기본 에러 UI
			return (
				<div className="min-h-[400px] flex flex-col items-center justify-center p-8">
					<div className="max-w-md w-full text-center">
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
