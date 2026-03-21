import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { GetLolBtiRecommendationsParams } from "@/shared/api/lolbti";

interface UseFetchLolbtiParams extends GetLolBtiRecommendationsParams {
	enabled?: boolean;
}

/** 비로그인 또는 롤BTI 미보유 유저용 추천 목록 (궁합 점수 없음) */
export const useFetchPublicLolbtiQuery = ({
	enabled = true,
	size = 20,
	...filters
}: UseFetchLolbtiParams = {}) => {
	const {
		data,
		isLoading,
		isError,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
	} = useInfiniteQuery({
		queryKey: ["lolbti", "boards", "public", { size, ...filters }],
		queryFn: ({ pageParam }) =>
			api.public.lolbti.getLolBtiRecommendations({
				...filters,
				size,
				cursorMemberId: pageParam,
			}),
		enabled,
		initialPageParam: undefined as number | undefined,
		getNextPageParam: (lastPage) => {
			if (lastPage.hasNext) {
				return lastPage.nextCursorMemberId;
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
	};
};

/** 로그인 + 롤BTI 보유 유저용 추천 목록 (궁합 점수 포함) */
export const useFetchPrivateLolbtiQuery = ({
	enabled = true,
	size = 20,
	...filters
}: UseFetchLolbtiParams & {
	compatibilityOrder?: "HIGH" | "LOW";
} = {}) => {
	const {
		data,
		isLoading,
		isError,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
	} = useInfiniteQuery({
		/** TODO: 롤bti 관련 key 설계 */
		queryKey: ["lolbti", "boards", "private", { size, ...filters }],
		queryFn: ({ pageParam }) =>
			api.private.lolbti.getLolBtiRecommendations({
				...filters,
				size,
				cursorMemberId: pageParam,
			}),
		enabled,
		initialPageParam: undefined as number | undefined, // cursorMemberId의 초기값은 undefined
		getNextPageParam: (lastPage) => {
			if (lastPage.hasNext) {
				return lastPage.nextCursorMemberId;
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
	};
};
