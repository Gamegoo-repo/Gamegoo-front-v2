import { useEffect } from "react";
import {
	FACEBOOK_SHARE_URL,
	GAMEGOO_SITE_URL,
	KAKAO_SDK_URL,
	KAKAO_SHARE_OBJECT_TYPE,
	X_SHARE_HASHTAGS,
	X_SHARE_SUFFIX,
	X_SHARE_URL,
} from "../config";

interface UseSNSShareParams {
	title?: string;
	url: string;
	option?: {
		windowOpenTarget: "_black" | "_parent" | "_self" | "_top";
	};
	imageUrl?: string;
	description?: string;
}

declare global {
	interface Window {
		Kakao: any;
	}
}

const useSNSShare = ({
	title,
	url,
	option,
	imageUrl,
	description,
}: UseSNSShareParams) => {
	const JAVASCRIPT_KEY = import.meta.env.PUBLIC_APP_JAVASCRIPT_KEY;

	const shareToX = () => {
		const tweetText = [
			title,
			description ? `"${description}"` : undefined,
			X_SHARE_SUFFIX,
		]
			.filter(Boolean)
			.join("\n");

		const params = new URLSearchParams({
			text: tweetText,
			url,
			hashtags: X_SHARE_HASHTAGS,
		});

		openWindow(`${X_SHARE_URL}?${params.toString()}`);
	};

	const shareToFacebook = () => {
		const sharedLink = encodeURIComponent(url);
		openWindow(`${FACEBOOK_SHARE_URL}?u=${sharedLink}`);
	};

	const shareToKakaoTalk = () => {
		if (window.Kakao === undefined) {
			return;
		}

		const kakao = window.Kakao;

		if (!kakao.isInitialized()) {
			kakao.init(JAVASCRIPT_KEY);
		}

		kakao.Share.sendDefault({
			objectType: KAKAO_SHARE_OBJECT_TYPE,
			content: {
				title: title,
				description: description,
				imageUrl: imageUrl,
				link: {
					mobileWebUrl: GAMEGOO_SITE_URL,
					webUrl: GAMEGOO_SITE_URL,
				},
			},
		});
	};

	const shareToNavigator = ({ text, url }: { text: string; url: string }) => {
		const sharedData = {
			text: text,
			url: url,
		};

		try {
			if (navigator.canShare?.(sharedData)) {
				navigator
					.share(sharedData)
					.then(() => {
						console.log("성공");
					})
					.catch(() => {
						console.log("취소");
					});
			}
		} catch (_ee) {
			console.log("실패");
		}
	};

	const openWindow = (url: string) => {
		window.open(url, option?.windowOpenTarget || "_blank");
	};

	useEffect(() => {
		if (document.querySelector(`script[src="${KAKAO_SDK_URL}"]`)) return;

		const script = document.createElement("script");
		script.src = KAKAO_SDK_URL;
		script.async = true;
		document.body.appendChild(script);
	}, []);

	return {
		isAvailNavigator: typeof navigator.share !== "undefined",
		shareToX,
		shareToFacebook,
		shareToKakaoTalk,
		shareToNavigator,
	};
};

export default useSNSShare;
