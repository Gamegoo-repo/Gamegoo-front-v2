import type { GameMode, Mike, Tier } from "@/shared/api";
import { GAME_MODE_LABELS, MIKE_LABELS, TIER_LABELS } from "./dropdown-labels";

export const GAME_MODE_ITEMS = [
	{ id: undefined as GameMode | undefined, title: "모든 모드" },
	...Object.entries(GAME_MODE_LABELS).map(([id, title]) => ({
		id: id as GameMode,
		title,
	})),
];

export const TIER_ITEMS = [
	{ id: undefined as Tier | undefined, title: "티어 전체" },
	...Object.entries(TIER_LABELS).map(([id, title]) => ({
		id: id as Tier,
		title,
	})),
];

export const MIKE_ITEMS = [
	{ id: undefined as Mike | undefined, title: "음성 채팅" },
	...Object.entries(MIKE_LABELS).map(([id, title]) => ({
		id: id as Mike,
		title,
	})),
];
