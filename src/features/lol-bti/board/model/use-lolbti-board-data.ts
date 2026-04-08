import { useQuery } from "@tanstack/react-query";
import { useLolBtiRecommendations } from "@/features/lol-bti/board/model/use-lolbti-recommendations";
import { getMyLolBtiResult } from "@/features/lol-bti/test/api";
import { lolbtiKeys } from "@/entities/lol-bti/config/query-keys";
import { useAuthStore } from "@/shared/model/use-auth-store";
import type { Tier } from "@/shared/api";

interface UseLolBtiBoardDataParams {
	tier?: Tier;
	sort?: "HIGH" | "LOW";
}

export const useLolBtiBoardData = ({
	tier,
	sort,
}: UseLolBtiBoardDataParams) => {
	const { isAuthenticated } = useAuthStore();

	// 1. 내 롤BTI 정보 패칭
	const { data: myBtiResult, isPending: isBtiPending } = useQuery({
		queryKey: lolbtiKeys.me(),
		queryFn: getMyLolBtiResult,
		enabled: isAuthenticated,
		throwOnError: false,
		retry: false,
		meta: { skipErrorCatcher: true },
	});

	const hasLolBti = isAuthenticated && !!myBtiResult;

	const privateQuery = useLolBtiRecommendations({
		type: "private",
		enabled: hasLolBti,
		tier,
		compatibilityOrder: sort ?? "HIGH",
	});

	const isPublicEnabled = !isAuthenticated || (!isBtiPending && !hasLolBti);
	const publicQuery = useLolBtiRecommendations({
		type: "public",
		enabled: isPublicEnabled,
		tier,
	});

	if (hasLolBti) {
		return {
			myBtiResult,
			hasLolBti: true as const,
			isLoading: (isAuthenticated && isBtiPending) || privateQuery.isLoading,
			pages: privateQuery.pages,
			isFetchingNextPage: privateQuery.isFetchingNextPage,
			hasNextPage: privateQuery.hasNextPage,
			fetchNextPage: privateQuery.fetchNextPage,
		};
	}

	return {
		myBtiResult,
		hasLolBti: false as const,
		isLoading: (isAuthenticated && isBtiPending) || publicQuery.isLoading,
		pages: publicQuery.pages,
		isFetchingNextPage: publicQuery.isFetchingNextPage,
		hasNextPage: publicQuery.hasNextPage,
		fetchNextPage: publicQuery.fetchNextPage,
	};
};
