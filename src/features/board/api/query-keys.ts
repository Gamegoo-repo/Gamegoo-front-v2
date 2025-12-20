import type { GameMode, Mike, Position, Tier } from "@/shared/api/@generated";

export const boardKeys = {
	all: ["board"] as const,
	lists: () => [...boardKeys.all, "list"] as const,
	list: (filters: {
		page?: number;
		gameMode?: GameMode;
		tier?: Tier;
		mainP?: Position;
		subP?: Position;
		mike?: Mike;
	}) => [...boardKeys.lists(), filters] as const,
	infiniteList: (filters: {
		gameMode?: GameMode;
		tier?: Tier;
		mainP?: Position;
		subP?: Position;
		mike?: Mike;
	}) => [...boardKeys.lists(), "infinite", filters] as const,
	details: () => [...boardKeys.all, "detail"] as const,
	detail: (id: number, isAuthenticated: boolean) =>
		[...boardKeys.details(), id, isAuthenticated] as const,
	myBoards: () => [...boardKeys.all, "my-boards"] as const,
	myBoard: (filters: { page?: number }) =>
		[...boardKeys.myBoards(), filters] as const,
} as const;
