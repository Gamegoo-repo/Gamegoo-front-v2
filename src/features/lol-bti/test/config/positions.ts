export const LOL_POSITIONS = [
	"top",
	"jungle",
	"mid",
	"adc",
	"support",
] as const;

export type LolPosition = (typeof LOL_POSITIONS)[number];

export const LOL_POSITION_LABEL: Record<LolPosition, string> = {
	top: "탑",
	jungle: "정글",
	mid: "미드",
	adc: "원딜",
	support: "서폿",
};
