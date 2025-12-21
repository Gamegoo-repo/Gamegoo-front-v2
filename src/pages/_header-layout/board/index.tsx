import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import PostList from "@/entities/post/ui/post-list";
import { useBoardFilterStore } from "@/features/board/model/board-filter-store";
import { useBoardModalStore } from "@/features/board/model/use-board-modal-store";
// import PostFormModalContainer from "@/features/board/ui/post-form-mo;
import BoardToolbarMobile from "@/features/board/ui/toolbar/board-toolbar-mobile";
import {
	type BoardListResponse,
	GameMode,
	Mike,
	Position,
	Tier,
} from "@/shared/api";
import { useResponsive } from "@/shared/model/responsive-context";
import BoardTable from "@/widgets/board-view/ui/board-table";
import BoardToolbarDesktop from "@/features/board/ui/toolbar/board-toolbar-desktop";

const searchSchema = z.object({
	page: z.number().min(1).optional().catch(1),
	mode: z.enum(GameMode).optional(),
	tier: z.enum(Tier).optional(),
	mainP: z.enum(Position).optional(),
	subP: z.enum(Position).optional(),
	mike: z.enum(Mike).optional(),
});

export const Route = createFileRoute("/_header-layout/board/")({
	validateSearch: searchSchema,
	component: BoardPage,
});

function BoardPage() {
	const { isMobile } = useResponsive();

	const { openDetailModal, openCreateModal, closeModal } = useBoardModalStore();

	const resetFilters = useBoardFilterStore((s) => s.resetFilters);

	useSearch({
		from: "/_header-layout/board/",
	});

	const handleRowClick = (row: BoardListResponse) => {
		openDetailModal(row.boardId);
	};

	useEffect(() => {
		resetFilters();
		return () => closeModal();
	}, []);

	return (
		<>
			{isMobile ? (
				<div className="flex w-full flex-col">
					<BoardToolbarMobile handleOpenCreateModal={openCreateModal} />
					<PostList />
				</div>
			) : (
				<div className="flex w-full flex-col pb-32">
					<BoardToolbarDesktop handleOpenCreateModal={openCreateModal} />
					<BoardTable onRowClick={handleRowClick} />
				</div>
			)}
		</>
	);
}
