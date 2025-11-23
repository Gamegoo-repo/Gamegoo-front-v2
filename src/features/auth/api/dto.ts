import type { BanType } from "@/shared/api";

export type AuthCallbackParams =
	| LoginSuccessParams
	| NeedSignupParams
	// | BannedErrorParams
	| ErrorParams;

export interface LoginSuccessParams {
	status: OAuthStatus.LOGIN_SUCCESS;
	accessToken: string;
	refreshToken: string;
	name: string;
	tag: string;
	profileImage: string;
	id: string;
	banType: BanType;
	banExpireAt: string;
	isBanned: boolean;
	banMessage?: string;
}

export interface NeedSignupParams {
	status: OAuthStatus.NEED_SIGNUP;
	puuid: string;
}

export interface ErrorParams {
	status: OAuthStatus.ERROR;
	error: string;
	message?: string;
}

export enum OAuthStatus {
	LOGIN_SUCCESS = "LOGIN_SUCCESS",
	NEED_SIGNUP = "NEED_SIGNUP",
	ERROR = "ERROR",
}

/**
 * 로그인 성공 응답인지 확인하는 타입 가드
 *
 * @param response - 파싱된 OAuth 콜백 파라미터
 * @returns 로그인 성공 응답이면 true, 타입을 LoginSuccessParams로 좁힘
 */
export function isLoginSuccess(
	response: AuthCallbackParams | null,
): response is LoginSuccessParams {
	return response?.status === OAuthStatus.LOGIN_SUCCESS;
}

/**
 * 회원가입이 필요한 응답인지 확인하는 타입 가드
 *
 * @param response - 파싱된 OAuth 콜백 파라미터
 * @returns 회원가입 필요하면 true
 */
export function isNeedSignup(
	response: AuthCallbackParams | null,
): response is NeedSignupParams {
	return response?.status === OAuthStatus.NEED_SIGNUP;
}

/**
 * 에러 응답인지 확인하는 타입 가드
 *
 * @param response - 파싱된 OAuth 콜백 파라미터
 * @returns 에러 응답이면 true
 */
export function isError(
	response: AuthCallbackParams | null,
): response is ErrorParams {
	return response?.status === OAuthStatus.ERROR;
}
