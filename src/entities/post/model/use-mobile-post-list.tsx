import { useInfiniteQuery } from "@tanstack/react-query";
import { boardKeys } from "@/features/board/api/query-keys";
import { GameMode, Mike, Position, Tier } from "@/shared/api";
import { fetchPostsWithCursor } from "../api/api";
import { useMemo } from "react";
import type { PageParam } from "../api/api.types";

interface UseMobilePostListParams {
	gameMode?: GameMode;
	tier?: Tier;
	mainP?: Position;
	subP?: Position;
	mike?: Mike;
}

export const useFetchPostsWithCursorQuery = (
	params: UseMobilePostListParams,
) => {
	const {
		data,
		isLoading,
		isFetching,
		isError,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
	} = useInfiniteQuery({
		queryKey: boardKeys.infiniteList(params),
		queryFn: ({ pageParam }) => fetchPostsWithCursor(params, pageParam),
		initialPageParam: { cursor: undefined, cursorId: undefined } as PageParam,
		getNextPageParam: (lastPage) => {
			if (lastPage?.hasNext) {
				return {
					cursor: lastPage.nextCursor,
					cursorId: lastPage.cursorId,
				};
			}
			return undefined;
		},
		staleTime: 5 * 60 * 1000,
	});

	return {
		pages: data?.pages,
		isLoading,
		isError,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
		isFetching,
	};
};
