import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { userKeys } from "@/entities/user/config/query-keys";
import UserProfile from "@/entities/user/ui/user-profile";
import { PopoverMenu } from "@/features/popover-menu";
import { BlockToggleMenu } from "@/features/popover-menu/menu-items/block-toggle-menu-item";
import type { BlockedMemberResponse } from "@/shared/api";
import { api } from "@/shared/api";
import { cn } from "@/shared/lib/utils";

export const Route = createFileRoute("/_header-layout/mypage/blocked")({
	component: RouteComponent,
});

function RouteComponent() {
	const { page = 1 } = useSearch({
		from: "/_header-layout/mypage/blocked",
	}) as { page?: number };

	const { data, isLoading, isError } = useQuery({
		queryKey: [...userKeys.blocked(), { page }],
		queryFn: async () => {
			const { data } = await api.private.block.getBlockList(page);
			return data.data;
		},
	});

	return (
		<div className="h-full w-full">
			<h2 className="bold-25 mb-4 border-gray-200 border-b pb-4">차단 목록</h2>

			{isLoading && (
				<div className="flex h-[300px] items-center justify-center text-gray-500">
					불러오는 중...
				</div>
			)}

			{isError && (
				<div className="flex h-[300px] items-center justify-center text-red-500">
					차단 목록을 불러오지 못했습니다.
				</div>
			)}

			{!isLoading &&
				!isError &&
				data &&
				(data.blockedMemberList.length > 0 ? (
					<>
						<ul className="flex w-full flex-col">
							{data.blockedMemberList.map((member: BlockedMemberResponse) => (
								<li
									key={member.memberId}
									className="flex items-center justify-between border-gray-200 border-b px-6 py-5"
								>
									<div className="flex items-center gap-4">
										<UserProfile id={member.profileImg} hasDropShadow={false} />
										<div className="medium-16 text-gray-800">{member.name}</div>
									</div>
									<PopoverMenu
										menuItems={[
											<BlockToggleMenu
												key="toggle"
												userId={member.memberId}
												relationshipStatus="blocked"
											/>,
										]}
									/>
								</li>
							))}
						</ul>

						<BlockedPagination totalPages={data.totalPage} />
					</>
				) : (
					<div className="flex min-h-[300px] items-center justify-center text-gray-500">
						차단 친구가 없습니다
					</div>
				))}
		</div>
	);
}

function BlockedPagination({ totalPages }: { totalPages: number }) {
	const navigation = useNavigate();
	const { page = 1, ...rest } = useSearch({
		from: "/_header-layout/mypage/blocked",
	}) as { page?: number };

	const pageGroupSize = 5;
	const currentGroup = Math.ceil(page / pageGroupSize);
	const startPage = (currentGroup - 1) * pageGroupSize + 1;
	const endPage = Math.min(currentGroup * pageGroupSize, totalPages);
	const visiblePages = Array.from(
		{ length: Math.max(endPage - startPage + 1, 0) },
		(_, i) => startPage + i,
	);

	const go = (next: number) =>
		navigation({
			to: ".",
			search: { ...rest, page: next },
		});

	return (
		<div className="mt-6 flex w-full items-center justify-center gap-4">
			<button
				type="button"
				onClick={() => page > 1 && go(page - 1)}
				disabled={page === 1}
				className={cn(
					"w-[14px] cursor-pointer text-gray-500",
					page === 1 && "cursor-not-allowed opacity-30",
				)}
				aria-label="이전 페이지"
			>
				‹
			</button>
			<ol className="flex items-center gap-2">
				{visiblePages.map((p) => {
					const isActive = page === p;
					return (
						<li className="px-[11px] py-[8px]" key={p}>
							<Link
								to="/mypage/blocked"
								search={{ ...rest, page: p }}
								className={cn(
									isActive
										? "font-bold text-violet-600"
										: "font-normal text-gray-500 text-sm hover:text-violet-400",
								)}
							>
								{p}
							</Link>
						</li>
					);
				})}
			</ol>
			<button
				type="button"
				onClick={() => page < totalPages && go(page + 1)}
				disabled={page === totalPages}
				className={cn(
					"w-[14px] cursor-pointer text-gray-500",
					page === totalPages && "cursor-not-allowed opacity-30",
				)}
				aria-label="다음 페이지"
			>
				›
			</button>
		</div>
	);
}
