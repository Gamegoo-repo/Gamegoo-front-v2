type CharacterId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const PROFILE_BG_CLASS: Record<CharacterId, string> = {
	1: "bg-violet-200",
	2: "bg-[#FAF9FF]",
	3: "bg-violet-400",
	4: "bg-[#FAF9FF]",
	5: "bg-gray-900",
	6: "bg-violet-400",
	7: "bg-[#FAF9FF]",
	8: "bg-violet-200",
};

export const getUserProfileBg = (id: number) => {
	if (id < 1 || id > 8) return PROFILE_BG_CLASS[1];
	return PROFILE_BG_CLASS[id as CharacterId];
};
