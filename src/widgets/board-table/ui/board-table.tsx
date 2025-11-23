import { useSearch } from "@tanstack/react-router";
import { useBoardList } from "@/entities/post/model/use-board-list";
import { useFetchMyBlockedUsers } from "@/entities/user/api/use-fetch-my-blocked-users";
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
	const { user } = useAuth();

	const { gameMode, tier, position, mike } = useBoardFilterStore();

	const { page: currentPage } = useSearch({
		from: "/_header-layout/board/",
	});

	/** TODO: isFetching 써도 되는지 확인하기 */
	const { data, isFetching } = useFetchMyBlockedUsers(currentPage || 1, !!user);

	const { isLoading, boards, totalPages } = useBoardList({
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
				isLoading={isLoading || isFetching}
				columns={
					!!user && data
						? getColumns({ user, blockedUsers: data })
						: getColumns()
				}
				ariaLabel="게시판 목록"
				onRowClick={onRowClick}
			/>
			{boards && boards.length > 0 && (
				<PaginationButtons totalPages={totalPages || 1} />
			)}
		</div>
	);
}
