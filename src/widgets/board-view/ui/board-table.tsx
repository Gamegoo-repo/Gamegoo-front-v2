import { useSearch } from "@tanstack/react-router";
import { useBoardList } from "@/entities/post/model/use-board-list";
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

	const {
		page: currentPage = 1,
		mode,
		tier,
		mike,
		position,
	} = useSearch({
		from: "/_header-layout/board/",
	});

	const { isLoading, data: boardData } = useBoardList({
		isAuthenticated,
		page: currentPage,
		gameMode: mode,
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
