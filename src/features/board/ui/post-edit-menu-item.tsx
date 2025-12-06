import {
	PopoverMenuItem,
	type PopoverMenuItemProps,
} from "@/features/popover-menu";
import { useBoardModalStore } from "../model/use-board-modal-store";

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
	const openEditModal = useBoardModalStore((set) => set.openEditModal);

	const menuItemProps: PopoverMenuItemProps = {
		text: "수정하기",
		onClick: () => {
			openEditModal(postId);
			onClosePopover?.();
		},
		className,
	};

	return <PopoverMenuItem {...menuItemProps} />;
}
