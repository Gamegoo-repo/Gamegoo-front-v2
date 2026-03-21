export type EventSource = "WEB" | "MOBILE";

export const getEventSource = (): EventSource => {
	const isMobileUA =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent,
		);

	const isSmallScreen = window.innerWidth <= 768;

	return isMobileUA || isSmallScreen ? "MOBILE" : "WEB";
};
