import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import PostList from "@/entities/post/ui/post-list";
import { useBoardFilterStore } from "@/features/board/model/board-filter-store";
import PostDetailModal from "@/features/board/ui/post-detail-modal";
import PostFormModalContainer from "@/features/board/ui/post-form-modal-container";
import BoardToolbarDesktop from "@/features/board/ui/toolbar/board-toolbar-desktop";
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

	/** 모달 상태 */
	const [isOpen, setIsOpen] = useState(false);
	const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

	const resetFilters = useBoardFilterStore((s) => s.resetFilters);

	useSearch({
		from: "/_header-layout/board/",
	});

	const handleRowClick = (row: BoardListResponse) => {
		setSelectedPostId(row.boardId);
	};

	useEffect(() => {
		resetFilters();
	}, []);

	return (
		<>
			{isMobile ? (
				<div className="flex w-full flex-col">
					<BoardToolbarMobile handleOpenCreateModal={() => setIsOpen(true)} />
					<PostList />
				</div>
			) : (
				<div className="flex w-full flex-col">
					<BoardToolbarDesktop handleOpenCreateModal={() => setIsOpen(true)} />
					<BoardTable onRowClick={handleRowClick} />

					{selectedPostId && (
						<PostDetailModal
							key={selectedPostId}
							postId={selectedPostId}
							onClose={() => {
								setSelectedPostId(null);
							}}
						/>
					)}
				</div>
			)}
			{isOpen && (
				<PostFormModalContainer
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					mode="create"
				/>
			)}
		</>
	);
}
