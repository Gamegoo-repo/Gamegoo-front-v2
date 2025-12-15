import { api } from "@/shared/api";
import type { FetchPostsWithCursorParams, PageParam } from "./api.types";

export const fetchPostsWithCursor = async (
	params: FetchPostsWithCursorParams,
	pageParam?: PageParam,
) => {
	const { gameMode, tier, mainP, subP, mike } = params;
	const response = await api.public.board.getBoardsWithCursor(
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
