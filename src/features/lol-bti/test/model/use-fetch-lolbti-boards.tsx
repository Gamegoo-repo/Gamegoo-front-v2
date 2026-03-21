import { useInfiniteQuery } from "@tanstack/react-query";
import { boardKeys } from "@/features/board/api/query-keys";
import type { GetLolBtiRecommendationsParams } from "../api/types";
import { getLolBtiRecommendations } from "../api/lolbti-integration-api";

export const useFetchLolbtiBoardsWithCursorQuery = ({
	isAuthenticated,
	...params
}: GetLolBtiRecommendationsParams & { isAuthenticated: boolean }) => {
	const {
		data,
		isLoading,
		isFetching,
		isError,
		fetchNextPage, // 다음 페이지 요청 시 사용하는 메서드
		isFetchingNextPage, // 다음 페이지를 불러오는 중인지 boolean 값으로 반환
		hasNextPage, // 다음 페이지가 있는지 boolean 값으로 반환
	} = useInfiniteQuery({
		queryKey: boardKeys.infiniteList(params),
		queryFn: ({ pageParam }) =>
			getLolBtiRecommendations({ isAuthenticated, ...params }),
		initialPageParam: { cursor: undefined, cursorMemberId: undefined },
		getNextPageParam: (lastPage) => {
			if (lastPage?.hasNext) {
				return {
					cursor: lastPage.nextCursor,
					cursorMemberId: lastPage.cursorMemberId,
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
