import { useContext } from "react";
import { ResponsiveContext } from "./responsive-context";

export default function useResponsive() {
	const context = useContext(ResponsiveContext);
	if (context === undefined) {
		throw new Error("useResponsive must be used within a ResponsiveProvider");
	}
	return context;
}
