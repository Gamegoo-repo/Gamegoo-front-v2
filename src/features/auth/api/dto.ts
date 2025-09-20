export enum OAuthStatus {
	LOGIN_SUCCESS = "LOGIN_SUCCESS",
	NEED_SIGNUP = "NEED_SIGNUP",
	ERROR = "ERROR",
}

export interface AuthCallbackParams {
	status: OAuthStatus;
	puuid: string | null;
	accessToken?: string;
	refreshToken?: string;
	name?: string;
	profileImage?: string;
	error?: string;
}
