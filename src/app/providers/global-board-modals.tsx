import PostDetailModal from "@/features/board/ui/post-detail-modal";
import PostFormModalContainer from "@/features/board/ui/post-form-modal-container";
import { useBoardModalStore } from "@/features/board/model/use-board-modal-store";

/**
 * 게시글 관련 모달들을 전역에서 관리하는 컴포넌트
 *
 * 어떤 페이지에서든 useBoardModalStore를 통해 모달을 열 수 있습니다.
 */
export function GlobalBoardModals() {
	const { activeModal, selectedPostId, closeModal } = useBoardModalStore();

	return (
		<>
			{activeModal === "detail" && selectedPostId && (
				<PostDetailModal
					key={selectedPostId}
					postId={selectedPostId}
					onClose={closeModal}
				/>
			)}
			{activeModal === "create" && (
				<PostFormModalContainer isOpen onClose={closeModal} mode="create" />
			)}
			{activeModal === "edit" && selectedPostId && (
				<PostFormModalContainer
					isOpen
					onClose={closeModal}
					mode="edit"
					postId={selectedPostId}
				/>
			)}
		</>
	);
}
