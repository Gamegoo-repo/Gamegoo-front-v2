import { QueryErrorResetBoundary } from "@tanstack/react-query";
import type { ReactNode } from "react";
import ErrorBoundary from "./error-boundary";

interface QueryErrorBoundaryProps {
	children: ReactNode;
	fallback?: (error: Error, reset: () => void) => ReactNode;
}

export function QueryErrorBoundary({
	children,
	fallback,
}: QueryErrorBoundaryProps) {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					fallback={
						fallback ||
						((_error, errorReset) => (
							<div className="min-h-[400px] flex flex-col items-center justify-center p-8">
								<div className="max-w-md w-full text-center">
									<div className="text-6xl mb-4">🔄</div>
									<h2 className="text-2xl font-bold text-gray-700 mb-2">
										데이터를 불러올 수 없습니다
									</h2>
									<p className="text-gray-500 mb-6">
										일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
									</p>
									<button
										type="button"
										onClick={() => {
											errorReset();
											reset();
										}}
										className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
									>
										다시 시도
									</button>
								</div>
							</div>
						))
					}
				>
					{children}
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}
