export const getWinRateColors = (winRate: number) => {
	if (winRate < 50) {
		return {
			bg: "bg-gray-700",
			text: "text-gray-700",
			border: "border-gray-700",
		};
	}
	if (winRate >= 70) {
		return {
			bg: "bg-secondary",
			text: "text-secondary",
			border: "border-secondary",
		};
	}
	return {
		bg: "bg-violet-600",
		text: "text-violet-600",
		border: "border-violet-600",
	};
};
