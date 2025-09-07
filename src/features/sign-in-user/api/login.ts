import { encode } from "js-base64";

export const login = () => {
	const redirect = 'https://local.gamegoo.co.kr/riot/callback';

	const riotAuthUrl = import.meta.env.PUBLIC_RIOT_AUTH_URL;
	const redirectUri = import.meta.env.PUBLIC_RIOT_REDIRECT_URI;
	const clientId = import.meta.env.PUBLIC_RIOT_CLIENT_ID;
	const responseType = import.meta.env.PUBLIC_RIOT_RESPONSE_TYPE;
	const scope = import.meta.env.PUBLIC_RIOT_SCOPE;

	const encodedState = encode(JSON.stringify({ redirect }));

	const authUrl = `${riotAuthUrl}?redirect_uri=${encodeURIComponent(
		redirectUri,
	)}&client_id=${clientId}&response_type=${responseType}&scope=${scope}&state=${encodeURIComponent(
		encodedState,
	)}&prompt=login`;

	console.log(authUrl);

	window.location.href = authUrl;
};
