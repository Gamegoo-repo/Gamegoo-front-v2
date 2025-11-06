import type { GameMode } from "@/shared/api";
import { GAME_MODE_LABELS } from "../config/dropdown-labels";

export const getGameModeTitle = (mode: GameMode | undefined) => {
	return mode ? GAME_MODE_LABELS[mode] : "모든 모드";
};
