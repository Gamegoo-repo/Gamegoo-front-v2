import { type AuthCallbackParams, OAuthStatus } from "./dto";

export const parseAuthCallbackParams = (): AuthCallbackParams | null => {
	try {
		const urlParams = new URLSearchParams(window.location.search);
		const error = urlParams.get("error");

		if (error) {
			return {
				status: OAuthStatus.ERROR,
				error: error,
				puuid: null,
				accessToken: undefined,
				refreshToken: undefined,
				name: undefined,
				profileImage: undefined,
			};
		}

		const status = urlParams.get("status") as OAuthStatus;

		if (!Object.values(OAuthStatus).includes(status)) {
			throw new Error(`Invalid state: ${status}`);
		}

		return {
			status,
			puuid: urlParams.get("puuid"),
			accessToken: urlParams.get("accessToken") || undefined,
			refreshToken: urlParams.get("refreshToken") || undefined,
			name: urlParams.get("name") || undefined,
			profileImage: urlParams.get("profileImage") || undefined,
			error: urlParams.get("error") || undefined,
		};
	} catch (error) {
		console.error("Failed to parse callback params:", error);
		return null;
	}
};
