import type { GameMode, Position, Tier } from "@/shared/api";

export interface FetchPostsWithCursorParams {
	gameMode?: GameMode;
	tier?: Tier;
	mainP?: Position;
	subP?: Position;
}

export interface PageParam {
	cursor?: string;
	cursorId?: number;
}
