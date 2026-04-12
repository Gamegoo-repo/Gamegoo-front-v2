import {
	createFileRoute,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { z } from "zod";
import { TIER_ITEMS } from "@/features/board/config/dropdown-items";
import { getTierTitle } from "@/features/board/lib/getTierTitle";
import LolBtiCardSkeleton from "@/features/lol-bti/board/ui/lolbti-card-skeleton";
import LolBtiTestCtaCard from "@/features/lol-bti/board/ui/lolbti-test-cta-card";
import MyLolBtiResultCard from "@/features/lol-bti/board/ui/my-lolbti-result-card";
import OtherLolBtiResultCard from "@/features/lol-bti/board/ui/other-lolbti-card";
import { Tier } from "@/shared/api";
import Dropdown from "@/shared/ui/dropdown/dropdown";
import UserRelationActions from "@/features/lol-bti/board/ui/user-relation-actions";
import OpenChatRoomButton from "@/features/lol-bti/board/ui/open-chat-room-button";
import UserProfileBottomSheet from "@/features/lol-bti/board/ui/user-profile-bottom-sheet";
import useResponsive from "@/shared/model/use-responsive";
import { useLolBtiBoardData } from "@/features/lol-bti/board/model/use-lolbti-board-data";
import UserProfileModal from "@/widgets/user-info/user-profile-modal";

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
	const { isMobile } = useResponsive();
	const { ref, inView } = useInView();
	const [selectedMemberId, setSelectedMemberId] = useState<number | undefined>(
		undefined,
	);

	const {
		myBtiResult,
		hasLolBti,
		isLoading,
		pages,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	} = useLolBtiBoardData({ tier: search.tier, sort: search.sort });

	useEffect(() => {
		if (!isLoading && !hasLolBti && search.sort !== undefined) {
			navigate({
				search: (prev) => ({ ...prev, sort: undefined }),
				replace: true,
			});
		}
	}, [isLoading, hasLolBti, search.sort, navigate]);

	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	const updateFilter = <K extends keyof typeof search>(
		key: K,
		value: (typeof search)[K],
	) => {
		navigate({
			search: (prev) => ({ ...prev, [key]: value, page: 1 }),
		});
	};

	return (
		<div className="flex h-full w-full flex-col gap-10 mobile:px-0 px-8 pb-32">
			{/* --- 1. 상단 필터 영역 --- */}
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

			{/* --- 2. 카드 리스트 영역 --- */}
			<section className="flex mobile:grid w-full flex-1 mobile:grid-cols-2 flex-col items-center gap-x-5 gap-y-7 lg:grid-cols-3 xl:grid-cols-4">
				{/* 2-1. 로딩 중일 때 스켈레톤 노출 */}
				{isLoading &&
					Array.from({ length: 12 }).map((_, index) => (
						<LolBtiCardSkeleton
							key={`skeleton-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								index
							}`}
						/>
					))}

				{/* 2-2. 로딩 완료 후 내 결과 or CTA 노출 */}
				{!isLoading &&
					(hasLolBti ? (
						<MyLolBtiResultCard result={myBtiResult} />
					) : (
						<LolBtiTestCtaCard />
					))}

				{/* 2-3. 롤BTI가 있는 유저의 추천 유저 리스트 노출 */}
				{!isLoading && hasLolBti
					? pages?.map((page) => {
							return page.recommendations.map((rec) => (
								<OtherLolBtiResultCard
									key={rec.memberId}
									result={rec}
									onClick={() => setSelectedMemberId(rec.memberId)}
									actions={<UserRelationActions result={rec} />}
								/>
							));
						})
					: pages?.map((page) =>
							page.recommendations.map((rec) => (
								<OtherLolBtiResultCard
									key={rec.memberId}
									result={rec}
									onClick={() => setSelectedMemberId(rec.memberId)}
									actions={<OpenChatRoomButton memberId={rec.memberId} />}
								/>
							)),
						)}

				{/* 2-4. 인피니트 스크롤 트리거 & 다음 페이지 로딩 스켈레톤 */}
				{!isLoading && hasNextPage && !isFetchingNextPage && <div ref={ref} />}
				{isFetchingNextPage && <LolBtiCardSkeleton />}
			</section>

			{selectedMemberId &&
				(isMobile ? (
					<UserProfileBottomSheet
						memberId={selectedMemberId}
						onClose={() => setSelectedMemberId(undefined)}
					/>
				) : (
					<UserProfileModal
						isOpen
						memberId={selectedMemberId}
						onClose={() => setSelectedMemberId(undefined)}
					/>
				))}
		</div>
	);
}
