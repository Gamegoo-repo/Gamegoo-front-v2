import { encode } from "js-base64";
import { STORAGE_KEYS } from "@/shared/config/storage";

export const login = () => {
	try {
		const appUrl =
			process.env.NODE_ENV === "development"
				? "http://localhost:3000/"
				: process.env.PUBLIC_APP_URL;
		const riotAuthUrl = process.env.PUBLIC_RIOT_AUTH_URL;
		const serverCallback = process.env.PUBLIC_RIOT_REDIRECT_URI;
		const clientId = process.env.PUBLIC_RIOT_CLIENT_ID;
		const responseType = process.env.PUBLIC_RIOT_RESPONSE_TYPE;
		const scope = process.env.PUBLIC_RIOT_SCOPE;

		if (!appUrl || !riotAuthUrl || !serverCallback || !clientId) {
			console.error("Missing required environment variables");
			throw new Error("로그인 설정이 올바르지 않습니다.");
		}

		const redirect = `${appUrl}/riot/callback`;
		const csrfToken = crypto.randomUUID();

		sessionStorage.setItem(STORAGE_KEYS.csrfToken, csrfToken);

		const state = {
			redirect,
			csrfToken,
		};

		const encodedState = encode(JSON.stringify(state));

		const params = new URLSearchParams({
			redirect_uri: serverCallback,
			client_id: clientId,
			response_type: responseType || "code",
			scope: scope || "openid",
			state: encodedState,
			prompt: "login",
		});

		const authUrl = `${riotAuthUrl}?${params.toString()}`;
		console.log(authUrl);

		window.location.href = authUrl;
	} catch (error) {
		console.error("Login error:", error);
		alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
	}
};
