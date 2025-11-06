import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useBumpPost } from "@/features/board/api/use-bump-post";
import BoardFilter from "@/features/board/ui/board-filter";
import BumpButton from "@/features/board/ui/bump-button";
import CreatePostModal from "@/features/board/ui/create-post-modal";
import PostDetailModal from "@/features/board/ui/post-detail-modal";
import RefetchButton from "@/features/board/ui/refetch-button";
import {
	type BoardListResponse,
	GameMode,
	Mike,
	Position,
	Tier,
} from "@/shared/api";
import BoardTable from "@/widgets/board-table/ui/board-table";

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
	const queryClient = useQueryClient();
	/** 모달 상태 */
	const [isOpen, setIsOpen] = useState(false);
	const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

	const refetchPost = async () => {
		await queryClient.refetchQueries({
			queryKey: ["boards"],
			type: "active",
		});
	};
	// const { gameMode, tier, position, mike } = useBoardFilterStore();

	const { page: currentPage, ...search } = useSearch({
		from: "/_header-layout/board/",
	});

	const handleRowClick = (row: BoardListResponse) => {
		setSelectedPostId(row.boardId);
	};

	const { mutate } = useBumpPost();
	return (
		<div className="w-full flex flex-col">
			<div className="w-full flex flex-row items-center justify-between mt-[60px] mb-8">
				<h2 className="text-[32px] text-gray-700 font-bold w-full text-start">
					게시판
				</h2>
				<RefetchButton onClick={refetchPost} />
			</div>
			<div className="w-full flex justify-between h-[58px] mb-6">
				<BoardFilter />
				<div className="flex gap-6 items-center">
					<BumpButton onClick={() => mutate()} />
					<button
						type="button"
						onClick={() => setIsOpen(true)}
						className="w-[248px] h-full text-white bold-14 bg-violet-600 rounded-xl cursor-pointer hover:bg-violet-700 active:scale-95 transition-all duration-200"
					>
						글 작성하기
					</button>
				</div>
			</div>
			<BoardTable onRowClick={handleRowClick} />
			{/* <PaginationButtons totalPages={totalPages || 1} /> */}

			{/** TODO: 모달을 조건부 렌더링하는게 맞는 방법인지 확인하기 */}
			{isOpen && (
				<CreatePostModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
			)}
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
	);
}
