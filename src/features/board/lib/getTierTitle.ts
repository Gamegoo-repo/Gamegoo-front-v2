import type { Tier } from "@/shared/api";
import { TIER_LABELS } from "../config/dropdown-labels";

export const getTierTitle = (tier: Tier | undefined) => {
	return tier ? TIER_LABELS[tier] : "티어 전체";
};
