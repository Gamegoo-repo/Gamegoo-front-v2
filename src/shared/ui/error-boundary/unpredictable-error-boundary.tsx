// src/shared/ui/error-boundary/unpredictable-error-boundary.tsx

import ErrorPage from "@/widgets/fallback/error-page";
import ErrorBoundary from "./error-boundary";

export type StrictPropsWithChildren<P = unknown> = P & {
	children: React.ReactNode;
};

/**
 * 예측 불가능한 에러를 처리하는 경계
 * - Error Boundary: RequestError를 catch해서 UI 표시
 */
const UnPredictableErrorBoundary = ({ children }: StrictPropsWithChildren) => {
	return <ErrorBoundary fallback={<ErrorPage />}>{children}</ErrorBoundary>;
};

export default UnPredictableErrorBoundary;
