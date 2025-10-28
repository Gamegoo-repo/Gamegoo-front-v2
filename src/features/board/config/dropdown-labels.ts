import type { GameMode, Mike, Tier } from "@/shared/api";

export const GAME_MODE_LABELS: Record<GameMode, string> = {
	FAST: "빠른 대전",
	SOLO: "솔로랭크",
	FREE: "자유랭크",
	ARAM: "칼바람 나락",
};

export const TIER_LABELS: Record<Tier, string> = {
	UNRANKED: "언랭크",
	IRON: "아이언",
	BRONZE: "브론즈",
	SILVER: "실버",
	GOLD: "골드",
	PLATINUM: "플래티넘",
	EMERALD: "에메랄드",
	DIAMOND: "다이아몬드",
	MASTER: "마스터",
	GRANDMASTER: "그랜드마스터",
	CHALLENGER: "챌린저",
};

export const MIKE_LABELS: Record<Mike, string> = {
	UNAVAILABLE: "음성 OFF",
	AVAILABLE: "음성 ON",
};
