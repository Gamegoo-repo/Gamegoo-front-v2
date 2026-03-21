import {
	createFileRoute,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { TIER_ITEMS } from "@/features/board/config/dropdown-items";
import { getTierTitle } from "@/features/board/lib/getTierTitle";
import { getMyLolBtiResult } from "@/features/lol-bti/test/api";
import Dropdown from "@/shared/ui/dropdown/dropdown";
import { Tier } from "@/shared/api";
import { useAuthStore } from "@/shared/model/use-auth-store";
import LolBtiTestCtaCard from "@/features/lol-bti/board/ui/lolbti-test-cta-card";
import MyLolBtiResultCard from "@/features/lol-bti/board/ui/my-lolbti-result-card";
import {
	useFetchPublicLolbtiQuery,
	useFetchPrivateLolbtiQuery,
} from "@/features/lol-bti/board/model/use-fetch-lolbti";
import OtherLolBtiResultCard from "@/features/lol-bti/board/ui/other-lolbti-card";
import LolBtiCardSkeleton from "@/features/lol-bti/board/ui/lolbti-card-skeleton";
import { useInView } from "react-intersection-observer";

type SortOption = "HIGH" | "LOW";

const SORT_OPTIONS = ["HIGH", "LOW"] as const;

const SORT_ITEMS = [
	{ id: "HIGH" as SortOption, title: "궁합 높음" },
	{ id: "LOW" as SortOption, title: "궁합 낮음" },
];

const getSortTitle = (sort: SortOption | undefined): string => {
	if (sort === "HIGH") return "궁합 높음";
	if (sort === "LOW") return "궁합 낮음";
	return "궁합 순";
};

const searchSchema = z.object({
	page: z.number().min(1).optional().catch(1),
	tier: z.enum(Tier).optional().catch(undefined),
	// 비회원 또는 롤BTI 없는 유저가 공유된 URL로 접근 시 .catch()로 자동 폴백
	sort: z.enum(SORT_OPTIONS).optional().catch(undefined),
});

export const Route = createFileRoute("/_header-layout/lolbti/")({
	validateSearch: searchSchema,
	component: RouteComponent,
});

function RouteComponent() {
	const search = useSearch({ from: "/_header-layout/lolbti/" });
	const navigate = useNavigate({ from: "/lolbti" });
	const { isAuthenticated } = useAuthStore();
	const { ref, inView } = useInView();

	const { data: myBtiResult, isPending: isBtiPending } = useQuery({
		queryKey: ["lolbti", "me"],
		queryFn: getMyLolBtiResult,
		enabled: isAuthenticated,
		throwOnError: false,
		retry: false,
		meta: { skipErrorCatcher: true },
	});

	const hasLolBti = isAuthenticated && !!myBtiResult;

	// 로그인 & 롤비티아이 검사를 마친 유저만 호출
	const {
		pages: privatePages,
		isLoading: isPrivateLoading,
		isFetchingNextPage: isPrivateFetchingNextPage,
		fetchNextPage: fetchNextPrivatePage,
		hasNextPage: hasNextPrivatePage,
	} = useFetchPrivateLolbtiQuery({
		enabled: hasLolBti,
		tier: search.tier,
		compatibilityOrder: search.sort || "HIGH",
	});
	// !로그인 || !롤비티아이 검사인 유저만 호출
	const {
		pages: publicPages,
		isLoading: isPublicLoading,
		isFetchingNextPage: isPublicFetchingNextPage,
		fetchNextPage: fetchNextPublicPage,
		hasNextPage: hasNextPublicPage,
	} = useFetchPublicLolbtiQuery({
		enabled: !hasLolBti,
		tier: search.tier,
	});

	const pages = hasLolBti ? privatePages : publicPages;
	const isLoading = hasLolBti ? isPrivateLoading : isPublicLoading;

	const isFetchingNextPage = hasLolBti
		? isPrivateFetchingNextPage
		: isPublicFetchingNextPage;

	const hasNextPage = hasLolBti ? hasNextPrivatePage : hasNextPublicPage;

	const fetchNextPage = hasLolBti ? fetchNextPrivatePage : fetchNextPublicPage;

	useEffect(() => {
		if (!hasLolBti && search.sort !== undefined) {
			navigate({
				search: (prev) => ({ ...prev, sort: undefined }),
				replace: true,
			});
		}
	}, [hasLolBti, search.sort, navigate]);

	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	/** 필터 업데이트 함수 */
	const updateFilter = <K extends keyof typeof search>(
		key: K,
		value: (typeof search)[K],
	) => {
		navigate({
			search: (prev) => ({ ...prev, [key]: value, page: 1 }),
		});
	};

	return (
		<div className="flex w-full flex-col gap-10 mobile:px-0 px-8 pb-32">
			<div className="flex gap-2">
				{hasLolBti && (
					<Dropdown
						selectedLabel={getSortTitle(search.sort) || "궁합순"}
						className="h-full mobile:w-[138px] w-[77px]"
						onSelect={(value) => updateFilter("sort", value)}
						items={SORT_ITEMS}
					/>
				)}
				<Dropdown
					selectedLabel={getTierTitle(search.tier)}
					className="h-full mobile:w-[138px] w-[89px]"
					onSelect={(value) => updateFilter("tier", value)}
					items={TIER_ITEMS}
				/>
			</div>
			<section className="flex mobile:grid w-full mobile:grid-cols-2 flex-col items-center gap-x-5 gap-y-7 lg:grid-cols-3 xl:grid-cols-4">
				{isAuthenticated && !isBtiPending && myBtiResult ? (
					<MyLolBtiResultCard result={myBtiResult} />
				) : (
					<LolBtiTestCtaCard />
				)}
				{isLoading
					? Array.from({ length: 12 }).map((_, index) => (
							<LolBtiCardSkeleton key={index} />
						))
					: pages?.map((page) =>
							page.recommendations.map((recommendation) => (
								<OtherLolBtiResultCard
									key={recommendation.memberId}
									result={recommendation}
								/>
							)),
						)}

				{pages && !isFetchingNextPage && hasNextPage && <div ref={ref} />}
				{isFetchingNextPage && <LolBtiCardSkeleton />}
			</section>
		</div>
	);
}
