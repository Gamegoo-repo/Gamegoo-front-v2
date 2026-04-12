import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { lolbtiKeys } from "@/entities/lol-bti/config/query-keys";
import type {
	GetMyLolBtiRecommendationsResponse,
	MyLolBtiRecommendation,
} from "@/shared/api/lolbti/types";

type RelationPatch = Pick<
	MyLolBtiRecommendation,
	"friend" | "friendRequestReceived" | "friendRequestSent" | "nonFriend"
>;

/**
 * 친구 관계 변경 시 롤BTI 추천 목록 캐시에서 해당 유저의 관계 필드만 수정
 */
export const updateLolBtiBoardRelation = (
	queryClient: QueryClient,
	userId: number,
	patch: RelationPatch,
) => {
	queryClient.setQueriesData<InfiniteData<GetMyLolBtiRecommendationsResponse>>(
		{ queryKey: lolbtiKeys.privateBoards() },
		(old) => {
			if (!old) return old;

			return {
				...old,
				pages: old.pages.map((page) => ({
					...page,
					recommendations: page.recommendations.map((rec) =>
						rec.memberId === userId ? { ...rec, ...patch } : rec,
					),
				})),
			};
		},
	);
};
