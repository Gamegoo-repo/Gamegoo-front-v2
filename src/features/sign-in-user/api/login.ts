import { encode } from "js-base64";


export const login = () => {
	const frontend_redirect = 'https://gamegoo.co.kr/riot/callback';

	const riotAuthUrl = import.meta.env.PUBLIC_RIOT_AUTH_URL;
	const SERVER_CALLBACK = import.meta.env.PUBLIC_RIOT_REDIRECT_URI;
	const clientId = import.meta.env.PUBLIC_RIOT_CLIENT_ID;
	const responseType = import.meta.env.PUBLIC_RIOT_RESPONSE_TYPE;
	const scope = import.meta.env.PUBLIC_RIOT_SCOPE;

	const state = {
      frontend_redirect,
    };

	const encodedState = encode(JSON.stringify(state));

	const authUrl = `${riotAuthUrl}?redirect_uri=${encodeURIComponent(
		SERVER_CALLBACK,
	)}&client_id=${clientId}&response_type=${responseType}&scope=${scope}&state=${encodeURIComponent(
		encodedState,
	)}&prompt=login`;

	window.location.href = authUrl;
};
