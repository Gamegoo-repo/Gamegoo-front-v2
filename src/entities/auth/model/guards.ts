import {
	type AuthCallbackParams,
	type ErrorParams,
	type LoginSuccessParams,
	type NeedSignupParams,
	OAuthStatus,
} from "./types";

export function isValidOAuthStatus(value: unknown): value is OAuthStatus {
	return (
		typeof value === "string" &&
		Object.values(OAuthStatus).includes(value as OAuthStatus)
	);
}

export function isLoginSuccess(
	response: AuthCallbackParams | null,
): response is LoginSuccessParams {
	return response?.status === OAuthStatus.LOGIN_SUCCESS;
}

export function isNeedSignup(
	response: AuthCallbackParams | null,
): response is NeedSignupParams {
	return response?.status === OAuthStatus.NEED_SIGNUP;
}

export function isError(
	response: AuthCallbackParams | null,
): response is ErrorParams {
	return response?.status === OAuthStatus.ERROR;
}
