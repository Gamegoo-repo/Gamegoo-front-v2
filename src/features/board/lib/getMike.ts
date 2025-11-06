import type { Mike } from "@/shared/api";
import { MIKE_LABELS } from "../config/dropdown-labels";

export const getMike = (tier: Mike | undefined) => {
	return tier ? MIKE_LABELS[tier] : "음성 채팅";
};
