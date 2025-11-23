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
				<div className="text-gray-700 regular-16 text-center">{row.idx}</div>
			),
		},
		{
			header: "소환사",
			width: "28%",
			accessor: (row) => (
				<div className="flex gap-2 items-center">
					<UserProfile id={row.profileImage} hasDropShadow={false} />
					<div className="flex flex-col gap-0.5 items-start">
						<span className="inline-block text-gray-800 semibold-16 max-w-[13ch] whitespace-nowrap overflow-hidden text-ellipsis">
							{row.gameName}
						</span>
						<span className="text-gray-600 regular-13">#{row.tag}</span>
					</div>
				</div>
			),
		},
		{
			header: "티어",
			width: "8%",
			accessor: (row) => <TierBadge tier={row.tier} rank={row.rank} />,
		},
		{
			header: "메모",
			width: "40%",
			accessor: (row) => (
				<div className="p-2 w-[320px] bg-gray-100 rounded-lg border border-gray-400 regular-13 text-gray-800">
					<p className="line-clamp-2 break-words">{row.contents}</p>
				</div>
			),
		},
		{
			header: "등록일시",
			width: "12%",
			accessor: (row) => (
				<div className="text-center medium-16 text-gray-500 inline-block whitespace-nowrap min-w-max w-full">
					{formatDateSimple(row.bumpTime || row.createdAt || "")}
				</div>
			),
		},
		{
			header: "",
			width: "2%",
			accessor: (row) => (
				<div className="w-full flex items-center">
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
		<div className="w-full h-full">
			<h2 className="bold-25 mb-4 border-b border-gray-200 pb-4">
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
				<div className="w-full min-w-[1055px] min-h-[500px] flex flex-col gap-15">
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
		<div className="flex w-full items-center justify-center gap-4 mt-6">
			<button
				type="button"
				onClick={() => page > 1 && go(page - 1)}
				disabled={page === 1}
				className={cn(
					"w-[14px] cursor-pointer text-gray-500",
					page === 1 && "opacity-30 cursor-not-allowed",
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
										: "text-sm font-normal text-gray-500 hover:text-violet-400",
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
					page === totalPages && "opacity-30 cursor-not-allowed",
				)}
				aria-label="다음 페이지"
			>
				›
			</button>
		</div>
	);
}
