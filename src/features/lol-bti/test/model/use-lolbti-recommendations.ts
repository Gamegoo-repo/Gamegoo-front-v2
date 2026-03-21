import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { GetLolBtiRecommendationsParams } from "@/shared/api/lolbti";

interface UseLolBtiRecommendationsOptions
	extends GetLolBtiRecommendationsParams {
	isAuthenticated: boolean;
}

/**
 * 롤BTI 기반 게시글 추천 목록 조회 훅
 *
 * isAuthenticated에 따라 다른 API를 호출합니다:
 * - 로그인: api.private.lolbti (JWT 기반 개인화 추천)
 * - 비로그인: api.public.lolbti (유형 기반 공개 추천)
 *
 * staleTime: 30초 (추천 데이터는 자주 변하지 않음)
 */
export const useLolBtiRecommendations = ({
	isAuthenticated,
	...params
}: UseLolBtiRecommendationsOptions) => {
	return useQuery({
		queryKey: ["lolbti", "recommendations", isAuthenticated, params],
		queryFn: () =>
			isAuthenticated
				? api.private.lolbti.getLolBtiRecommendations(params)
				: api.public.lolbti.getLolBtiRecommendations(params),
		staleTime: 30 * 1000,
		gcTime: 60 * 1000,
	});
};
