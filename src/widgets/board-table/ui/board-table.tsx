import { useSearch } from "@tanstack/react-router";
import { useBoardList } from "@/entities/post/model/use-board-list";
import { useBoardFilterStore } from "@/features/board/model/board-filter-store";
import PaginationButtons from "@/features/board/ui/pagination-buttons";
import type { BoardListResponse } from "@/shared/api";
import Table from "@/shared/ui/table/table";
import { COLUMNS } from "../config/columns";

export default function BoardTable({
	onRowClick,
}: {
	onRowClick?: (row: BoardListResponse) => void;
}) {
	const { gameMode, tier, position, mike } = useBoardFilterStore();

	const { page: currentPage, ...search } = useSearch({
		from: "/_header-layout/board/",
	});

	const { isPending, isError, error, boards, totalPages } = useBoardList({
		page: currentPage,
		gameMode: gameMode,
		tier: tier,
		mainP: position,
		subP: undefined,
		mike: mike,
	});

	return (
		<div className="w-full min-w-[1055px] min-h-[500px] flex flex-col gap-15">
			<Table<{ id: number } & BoardListResponse>
				data={
					boards
						? boards.map((post) => ({
								...post,
								id: post.boardId,
							}))
						: undefined
				}
				columns={COLUMNS}
				ariaLabel="게시판 목록"
				onRowClick={onRowClick}
			/>
			{boards && boards.length > 0 && (
				<PaginationButtons totalPages={totalPages || 1} />
			)}
		</div>
	);
}
