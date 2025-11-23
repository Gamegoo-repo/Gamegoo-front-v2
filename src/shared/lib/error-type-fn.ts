import type { AxiosError } from "axios";
import { AUTH_ERROR_MESSAGES } from "../config/error-message/auth-error";
import type { ApiErrorResponse } from "./query-client";

export const isApiError = (
	error: unknown,
): error is AxiosError<ApiErrorResponse> => {
	return (
		typeof error === "object" &&
		error !== null &&
		"isAxiosError" in error &&
		error.isAxiosError === true
	);
};

export const isAuthError = (
	error: unknown,
): error is AxiosError<ApiErrorResponse> & {
	response: { data: { errorCode: keyof typeof AUTH_ERROR_MESSAGES } };
} => {
	const authErrorKeys = Object.keys(AUTH_ERROR_MESSAGES);

	if (!isApiError(error) || !error.response?.data) {
		return false;
	}

	const errorCode = error.response.data.code;

	return typeof errorCode === "string" && authErrorKeys.includes(errorCode);
};

export const isServerError = (error: unknown): boolean => {
	if (!isApiError(error) || !error.response) {
		return false;
	}

	return error.response.status >= 500;
};
