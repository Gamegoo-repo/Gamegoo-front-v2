import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

declare global {
	interface Window {
		dataLayer?: unknown[];
		gtag?: (...args: unknown[]) => void;
	}
}

export function GoogleAnalyticsTracker() {
	const { pathname } = useLocation();

	useEffect(() => {
		if (typeof window === "undefined") return;
		if (typeof window.gtag !== "function") return;

		const pagePath =
			window.location.pathname + window.location.search + window.location.hash;

		window.gtag("event", "page_view", { page_path: pagePath });
	}, [pathname]);

	return null;
}
