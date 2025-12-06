import { useEffect, useState } from "react";
import { isApiError, isServerError } from "@/shared/lib/error-type-fn.ts";
import toast from "@/shared/lib/toast/api.ts";
import { SERVER_ERROR_MESSAGES } from "../../config/error-message/index.ts";
import { useAppErrorStore } from "./app-error-store";

// 서버가 주는 에러 코드인지 확인
const isPredictableError = (error: unknown): boolean => {
	// AxiosError인지 확인
	if (!isApiError(error) || !error.response?.data.code) return false;

	// 서버 에러 -  예측 불가능 에러
	if (isServerError(error)) return false;

	// SERVER_ERROR_MESSAGES에 있는 코드인지 확인
	return SERVER_ERROR_MESSAGES[error.response?.data.code] !== undefined;
};

export const ErrorCatcher = ({ children }: React.PropsWithChildren) => {
	const error = useAppErrorStore((s) => s.appError);
	const [throwableError, setThrowableError] = useState<Error | null>(null);

	if (throwableError) {
		throw throwableError;
	}

	useEffect(() => {
		if (!error) return;

		// 예측 가능한 에러인지 확인 -> 가능: Toast UI , 불가능: Fallback UI
		if (!isApiError(error) || !isPredictableError(error)) {
			setThrowableError(error);
			useAppErrorStore.setState({ appError: null });
			return;
		}

		if (
			error.response?.data.code &&
			error.response?.data.code in SERVER_ERROR_MESSAGES
		) {
			const message =
				SERVER_ERROR_MESSAGES[
					error.response?.data.code as keyof typeof SERVER_ERROR_MESSAGES
				];
			toast.error(message);
		}

		// 에러 처리 후 상태 초기화
		useAppErrorStore.setState({ appError: null });
	}, [error]);

	return children;
};
