import { useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { useBoardList } from "@/entities/post/model/use-board-list";
import { useBoardFilterStore } from "@/features/board/model/board-filter-store";
import PaginationButtons from "@/features/board/ui/pagination-buttons";
import type { BoardListResponse } from "@/shared/api";
import { useAuth } from "@/shared/model/use-auth";
import Table from "@/shared/ui/table/table";
import { getColumns } from "../config/columns";

export default function BoardTable({
	onRowClick,
}: {
	onRowClick?: (row: BoardListResponse) => void;
}) {
	const { user, isAuthenticated } = useAuth();

	const { gameMode, tier, position, mike } = useBoardFilterStore();

	const { page: currentPage = 1 } = useSearch({
		from: "/_header-layout/board/",
	});

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "instant" });
	}, []);

	/** TODO: isFetching 써도 되는지 확인하기 */
	// const { data, isFetching } = useFetchMyBlockedUsers(currentPage || 1, !!user);

	const { isLoading, data: boardData } = useBoardList({
		isAuthenticated,
		page: currentPage,
		gameMode: gameMode,
		tier: tier,
		mainP: position,
		subP: undefined,
		mike: mike,
	});

	return (
		<section className="flex min-h-[500px] w-full min-w-[1055px] flex-col gap-15">
			<Table<{ id: number } & BoardListResponse>
				data={
					boardData?.boards
						? boardData.boards.map((post) => ({
								...post,
								id: post.boardId,
							}))
						: undefined
				}
				isLoading={isLoading}
				columns={
					!!user && isAuthenticated
						? getColumns({ isAuthenticated, user })
						: getColumns()
				}
				ariaLabel="게시판 목록"
				onRowClick={onRowClick}
			/>
			{boardData?.boards && boardData?.boards.length > 0 && (
				<PaginationButtons totalPages={boardData?.totalPages || 1} />
			)}
		</section>
	);
}
