import { api } from "@/shared/api";
import type { FetchPostsWithCursorParams, PageParam } from "./api.types";

export const fetchPostsWithCursor = async (
	isAuthenticated: boolean,
	params: FetchPostsWithCursorParams,
	pageParam?: PageParam,
) => {
	const { gameMode, tier, mainP, subP, mike } = params;

	const boardService = isAuthenticated ? api.private.board : api.public.board;
	const response = await boardService.getBoardsWithCursor(
		pageParam?.cursor,
		pageParam?.cursorId,
		gameMode,
		tier,
		mainP,
		subP,
		mike,
	);

	return response.data.data;
};
