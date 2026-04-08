import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { GetLolBtiRecommendationsParams } from "@/shared/api/lolbti";
import { lolbtiKeys } from "@/entities/lol-bti/config/query-keys";
import type {
	GetLolBtiRecommendationsResponse,
	GetMyLolBtiRecommendationsResponse,
} from "@/shared/api/lolbti/types";

interface BaseParams {
	enabled?: boolean;
	size?: number;
	tier?: GetLolBtiRecommendationsParams["tier"];
}

export interface PublicRecommendationsParams extends BaseParams {
	type: "public";
}

export interface PrivateRecommendationsParams extends BaseParams {
	type: "private";
	compatibilityOrder?: "HIGH" | "LOW";
}

/** 비로그인 / 롤BTI 미보유 유저용 추천 목록 (궁합 점수 없음) */
export function useLolBtiRecommendations(params: PublicRecommendationsParams): {
	pages: GetLolBtiRecommendationsResponse[] | undefined;
	isLoading: boolean;
	isError: boolean;
	fetchNextPage: () => void;
	isFetchingNextPage: boolean;
	hasNextPage: boolean;
};

/** 로그인 + 롤BTI 보유 유저용 추천 목록 (궁합 점수 포함) */
export function useLolBtiRecommendations(
	params: PrivateRecommendationsParams,
): {
	pages: GetMyLolBtiRecommendationsResponse[] | undefined;
	isLoading: boolean;
	isError: boolean;
	fetchNextPage: () => void;
	isFetchingNextPage: boolean;
	hasNextPage: boolean;
};

export function useLolBtiRecommendations(
	params: PublicRecommendationsParams | PrivateRecommendationsParams,
): {
	pages:
		| GetLolBtiRecommendationsResponse[]
		| GetMyLolBtiRecommendationsResponse[]
		| undefined;
	isLoading: boolean;
	isError: boolean;
	fetchNextPage: () => void;
	isFetchingNextPage: boolean;
	hasNextPage: boolean;
} {
	const { type, enabled = true, size = 20, tier } = params;
	const compatibilityOrder =
		type === "private" ? params.compatibilityOrder : undefined;

	const {
		data,
		isLoading,
		isError,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
	} = useInfiniteQuery({
		queryKey: [
			...(type === "private"
				? lolbtiKeys.privateBoards()
				: lolbtiKeys.publicBoards()),
			{ size, tier, compatibilityOrder },
		],
		queryFn: ({ pageParam }) =>
			type === "private"
				? api.private.lolbti.getLolBtiRecommendations({
						size,
						tier,
						cursorMemberId: pageParam,
						compatibilityOrder,
					})
				: api.public.lolbti.getLolBtiRecommendations({
						size,
						tier,
						cursorMemberId: pageParam,
					}),
		enabled,
		initialPageParam: undefined as number | undefined,
		getNextPageParam: (lastPage) =>
			lastPage.hasNext ? lastPage.nextCursorMemberId : undefined,
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
}
