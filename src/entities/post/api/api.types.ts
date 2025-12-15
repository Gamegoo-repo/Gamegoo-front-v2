import type { GameMode, Mike, Position, Tier } from "@/shared/api";

export interface FetchPostsWithCursorParams {
	gameMode?: GameMode;
	tier?: Tier;
	mainP?: Position;
	subP?: Position;
	mike?: Mike;
}

export interface PageParam {
	cursor?: string;
	cursorId?: number;
}
