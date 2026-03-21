import { useEffect } from "react";

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

const useSNSShare = ({ title, url, option, imageUrl, description }: UseSNSShareParams) => {
	const JAVASCRIPT_KEY = import.meta.env.PUBLIC_APP_JAVASCRIPT_KEY;

	const shareToX = () => {
		const tweetText = [title, description ? `"${description}"` : undefined, "당신의 롤BTI는?"]
			.filter(Boolean)
			.join("\n");

		const params = new URLSearchParams({
			text: tweetText,
			url,
			hashtags: "롤BTI,롤,리그오브레전드",
		});

		openWindow(`https://x.com/intent/tweet?${params.toString()}`);
	};

	const shareToFacebook = () => {
		const sharedLink = encodeURIComponent(url);
		openWindow(`http://www.facebook.com/sharer/sharer.php?u=${sharedLink}`);
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
			objectType: "feed",
			content: {title: title,
				description: description,
			imageUrl: imageUrl,
			link: {
				mobileWebUrl: 'https://gamegoo.co.kr',
				webUrl: 'https://gamegoo.co.kr',
			},
			}
		})
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
		const script = document.createElement("script");
		script.src = "https://developers.kakao.com/sdk/js/kakao.js";
		script.async = true;

		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
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
