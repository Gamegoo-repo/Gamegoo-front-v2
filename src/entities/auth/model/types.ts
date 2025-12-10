import type { BanType } from "@/shared/api";

export const OAuthStatus = {
	LOGIN_SUCCESS: "LOGIN_SUCCESS",
	NEED_SIGNUP: "NEED_SIGNUP",
	ERROR: "ERROR",
} as const;

export type OAuthStatus = (typeof OAuthStatus)[keyof typeof OAuthStatus];

export type AuthCallbackParams =
	| LoginSuccessParams
	| NeedSignupParams
	// | BannedErrorParams
	| ErrorParams;

export interface LoginSuccessParams {
	status: typeof OAuthStatus.LOGIN_SUCCESS;
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
	status: typeof OAuthStatus.NEED_SIGNUP;
	puuid: string;
}

export interface ErrorParams {
	status: typeof OAuthStatus.ERROR;
	error: string;
	message?: string;
}
