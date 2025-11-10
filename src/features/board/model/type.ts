import type { GameMode, Mike, Position, Tier } from "@/shared/api";

export interface FilterState {
	gameMode: GameMode | undefined;
	tier: Tier | undefined;
	mike: Mike | undefined;
	position: Position | undefined;
}
