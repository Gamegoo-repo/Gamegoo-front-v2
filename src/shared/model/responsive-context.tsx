import { createContext, type ReactNode, useContext } from "react";
import { mediaQueries, useMediaQuery } from "./use-media-query";

type ResponsiveContextType = {
	isMobile: boolean;
	isTablet: boolean;
	isDesktop: boolean;
	isTabletAndUp: boolean;
	isDesktopAndUp: boolean;
	currentBreakpoint: "mobile" | "tablet" | "desktop";
};

export const ResponsiveContext = createContext<
	ResponsiveContextType | undefined
>(undefined);

export function ResponsiveProvider({ children }: { children: ReactNode }) {
	const isMobile = useMediaQuery(mediaQueries.isMobile);
	const isTablet = useMediaQuery(mediaQueries.isTablet);
	const isDesktop = useMediaQuery(mediaQueries.isDesktop);
	const isTabletAndUp = useMediaQuery(mediaQueries.isTabletAndUp);
	const isDesktopAndUp = useMediaQuery(mediaQueries.isDesktopAndUp);

	const value = {
		isMobile,
		isTablet,
		isDesktop,
		isTabletAndUp,
		isDesktopAndUp,
		currentBreakpoint: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
	} as const;

	return (
		<ResponsiveContext.Provider value={value}>
			{children}
		</ResponsiveContext.Provider>
	);
}

// Hook: 어디서든 사용 가능
export function useResponsive() {
	const context = useContext(ResponsiveContext);
	if (context === undefined) {
		throw new Error("useResponsive must be used within a ResponsiveProvider");
	}
	return context;
}
