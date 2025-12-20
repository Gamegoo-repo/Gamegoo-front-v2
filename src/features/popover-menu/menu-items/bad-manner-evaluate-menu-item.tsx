import { useChatDialogStore } from "@/entities/chat";
import type { PopoverMenuItemProps } from "../popover-menu-item";
import { PopoverMenuItem } from "../popover-menu-item";

interface BadMannerEvaluateMenuItemProps {
	className?: string;
	onClosePopover?: () => void;
}

export function BadMannerEvaluateMenuItem({
	className,
	onClosePopover,
}: BadMannerEvaluateMenuItemProps) {
	const { openMannerModal } = useChatDialogStore();

	const handleOpen = () => {
		onClosePopover?.();
		openMannerModal("badManner");
	};

	const menuItemProps: PopoverMenuItemProps = {
		text: "비매너 평가",
		onClick: handleOpen,
		className,
	};

	return <PopoverMenuItem {...menuItemProps} />;
}
