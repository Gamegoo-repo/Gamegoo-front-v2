import { useEffect, useState } from "react";

export const breakpoints = {
	mobile: 700,
	tablet: 950,
	desktop: 1200,
} as const;

export const mediaQueries = {
	isMobile: `(max-width: ${breakpoints.mobile}px)`,
	isTabletAndUp: `(min-width: ${breakpoints.mobile + 1}px)`,
	isTablet: `(min-width: ${breakpoints.mobile + 1}px) and (max-width: ${breakpoints.tablet}px)`,
	isDesktopAndUp: `(min-width: ${breakpoints.tablet + 1}px)`,
	isDesktop: `(min-width: ${breakpoints.desktop}px)`,
} as const;

export function useMediaQuery(query: string): boolean {
	const getMatches = (query: string): boolean => {
		if (typeof window !== "undefined") {
			return window.matchMedia(query).matches;
		}
		return false;
	};

	const [matches, setMatches] = useState<boolean>(getMatches(query));

	function handleChange() {
		setMatches(getMatches(query));
	}

	useEffect(() => {
		const matchMedia = window.matchMedia(query);
		handleChange();

		matchMedia.addEventListener("change", handleChange);

		return () => {
			matchMedia.removeEventListener("change", handleChange);
		};
	}, [query]);

	return matches;
}
