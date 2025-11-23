import { encode } from "js-base64";
import { STORAGE_KEYS } from "@/shared/config/storage";

export const login = () => {
	const redirect = `${process.env.PUBLIC_APP_URL}/riot/callback`;
	const csrfToken = crypto.randomUUID();

	sessionStorage.setItem(STORAGE_KEYS.csrfToken, csrfToken);

	const riotAuthUrl = process.env.PUBLIC_RIOT_AUTH_URL;
	const SERVER_CALLBACK = import.meta.env.PUBLIC_RIOT_REDIRECT_URI;
	const clientId = process.env.PUBLIC_RIOT_CLIENT_ID;
	const responseType = process.env.PUBLIC_RIOT_RESPONSE_TYPE;
	const scope = process.env.PUBLIC_RIOT_SCOPE;

	const state = {
		redirect,
		csrfToken,
	};

	const encodedState = encode(JSON.stringify(state));

	const authUrl = `${riotAuthUrl}?redirect_uri=${encodeURIComponent(
		SERVER_CALLBACK,
	)}&client_id=${clientId}&response_type=${responseType}&scope=${scope}&state=${encodeURIComponent(
		encodedState,
	)}&prompt=login`;

	window.location.href = authUrl;
};
