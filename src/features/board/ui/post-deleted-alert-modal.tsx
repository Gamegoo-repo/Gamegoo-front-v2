import { createPortal } from "react-dom";
import TrashIcon from "@/shared/assets/icons/trash.svg?react";
import { usePostDeletedAlertModalState } from "../model/post-deleted-alert-modal-store";
import { useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "../api/query-keys";

function PostDeletedAlertModal() {
	const { isOpen, closeModal } = usePostDeletedAlertModalState();
	const modalRoot = document.getElementById("modal-root") || document.body;
	const queryClient = useQueryClient();

	if (!isOpen) return null;

	return createPortal(
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/62">
			<div className="absolute bottom-[28px] mobile:w-[640px] w-[90%] overflow-hidden">
				<div className="mb-2 mobile:mb-3 flex flex-col items-center justify-center mobile:rounded-[18px] rounded-[14px] bg-white px-0 py-5 text-center font-bold mobile:text-lg text-base">
					<div className="mobile:mb-4 h-12 mobile:h-[72px] mobile:w-[72px] w-12">
						<TrashIcon className="h-full w-full" />
					</div>
					<p className="m-0 text-gray-900">해당 글은 삭제된 글입니다.</p>
				</div>
				<button
					type="button"
					className="w-full cursor-pointer mobile:rounded-[18px] rounded-[14px] bg-white mobile:py-4 py-3 text-center font-bold mobile:text-lg text-base text-gray-900 hover:bg-gray-50"
					onClick={() => {
						queryClient.invalidateQueries({ queryKey: boardKeys.all });
						closeModal();
					}}
				>
					확인
				</button>
			</div>
		</div>,
		modalRoot,
	);
}

export default PostDeletedAlertModal;
