import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import TierBadge from "@/entities/game/ui/tier-badge";
import UserProfile from "@/entities/user/ui/user-profile";
import { boardKeys } from "@/features/board/api/query-keys";
import PostActionMenu from "@/features/board/ui/post-action-menu";
import { api, type MyBoardListResponse } from "@/shared/api";
import { formatDateSimple } from "@/shared/lib/format-date-simple";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/shared/model/use-auth";
import type { Column } from "@/shared/ui/table/table";
import Table from "@/shared/ui/table/table";

export const Route = createFileRoute("/_header-layout/mypage/post")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = useAuth();
	const { page = 1 } = useSearch({
		from: "/_header-layout/mypage/post",
	}) as { page?: number };

	const { data, isLoading, isError } = useQuery({
		queryKey: boardKeys.myBoard({ page }),
		queryFn: async () => {
			const { data } = await api.private.board.getMyBoardList(page);
			return data.data;
		},
	});

	const rows =
		data?.myBoards?.map((row, idx) => ({
			...row,
			id: row.boardId,
			idx: (page - 1) * 10 + (idx + 1),
		})) || [];

	const columns: Column<MyBoardListResponse & { id: number; idx: number }>[] = [
		{
			header: "",
			width: "4%",
			accessor: (row) => (
				<div className="text-center mobile:font-bold mobile:text-base text-gray-800">
					{row.idx}
				</div>
			),
		},
		{
			header: "소환사",
			width: "30%",
			accessor: (row) => (
				<div className="flex items-center gap-5">
					<UserProfile
						id={row.profileImage}
						hasDropShadow={false}
						className="mobile:h-[50px] mobile:w-[50px]"
					/>
					<div className="flex items-center gap-2">
						<span className="inline-block max-w-[13ch] overflow-hidden text-ellipsis whitespace-nowrap mobile:font-semibold mobile:text-base text-gray-800">
							{row.gameName}
						</span>
						<span className="mobile:font-semibold mobile:text-sm text-gray-500">
							#{row.tag}
						</span>
					</div>
				</div>
			),
		},
		{
			header: "티어",
			width: "25%",
			accessor: (row) => (
				<div className="flex w-full items-center justify-center">
					<TierBadge tier={row.tier} rank={row.rank} />
				</div>
			),
		},
		{
			header: "메모",
			width: "30%",
			accessor: (row) => (
				<div className="w-full rounded-lg border border-gray-400 bg-gray-100 p-2 mobile:text-[13px] text-gray-800">
					<p className="line-clamp-2 break-words">{row.contents}</p>
				</div>
			),
		},
		{
			header: "등록일시",
			width: "13%",
			accessor: (row) => (
				<div className="medium-16 inline-block w-full min-w-max whitespace-nowrap text-center text-gray-500">
					{formatDateSimple(row.bumpTime || row.createdAt || "")}
				</div>
			),
		},
		{
			header: "",
			width: "3%",
			accessor: (row) => (
				<div className="flex w-full items-center">
					<PostActionMenu
						postId={row.boardId}
						currentUserId={user?.id || 0}
						postOwnerId={row.memberId}
						isBlocked={false}
					/>
				</div>
			),
		},
	];

	return (
		<div className="h-full w-full">
			<h2 className="bold-25 mb-4 border-gray-200 border-b pb-4">
				내가 작성한 글
			</h2>

			{isLoading && (
				<div className="flex h-[300px] items-center justify-center text-gray-500">
					불러오는 중...
				</div>
			)}

			{isError && (
				<div className="flex h-[300px] items-center justify-center text-red-500">
					목록을 불러오지 못했습니다.
				</div>
			)}

			{!isLoading && !isError && (
				<div className="flex min-h-[500px] w-full min-w-[1055px] flex-col gap-15">
					<Table
						data={rows}
						columns={columns}
						ariaLabel="내가 작성한 글 목록"
					/>
					{data && data.totalPage > 1 && (
						<MyPostsPagination totalPages={data.totalPage} />
					)}
				</div>
			)}
		</div>
	);
}

function MyPostsPagination({ totalPages }: { totalPages: number }) {
	const navigation = useNavigate();
	const { page = 1, ...rest } = useSearch({
		from: "/_header-layout/mypage/post",
	}) as { page?: number };

	const pageGroupSize = 10;
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
								to="/mypage/post"
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
