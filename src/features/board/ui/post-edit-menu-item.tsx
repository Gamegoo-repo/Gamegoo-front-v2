import { useState } from "react";
import {
	PopoverMenuItem,
	type PopoverMenuItemProps,
} from "@/features/popover-menu";
import PostFormModalContainer from "./post-form-modal-container";

interface PostEditMenuItemProps {
	postId: number;
	className?: string;
	onClosePopover?: () => void;
}

export function PostEditMenuItem({
	postId,
	className,
	onClosePopover,
}: PostEditMenuItemProps) {
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const menuItemProps: PopoverMenuItemProps = {
		text: "수정하기",
		onClick: () => {
			setIsEditModalOpen(true);
			onClosePopover?.();
		},
		className,
	};

	/** TODO: 게시글 작성 시 contents가 무조건 존재해야 하는데, 옵셔널 -> 서버에 수정 요청해야 함. 이후에 postToEdit 수정할 것*/
	return (
		<>
			<PopoverMenuItem {...menuItemProps} />
			{isEditModalOpen && (
				<PostFormModalContainer
					isOpen={isEditModalOpen}
					onClose={() => {
						setIsEditModalOpen(false);
					}}
					mode="edit"
					postId={postId}
				/>
			)}
		</>
	);
}
