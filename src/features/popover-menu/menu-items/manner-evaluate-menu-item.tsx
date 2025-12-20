import { useChatDialogStore } from "@/entities/chat";
import type { PopoverMenuItemProps } from "../popover-menu-item";
import { PopoverMenuItem } from "../popover-menu-item";

interface MannerEvaluateMenuItemProps {
	className?: string;
	onClosePopover?: () => void;
}

export function MannerEvaluateMenuItem({
	className,
	onClosePopover,
}: MannerEvaluateMenuItemProps) {
	const { openMannerModal } = useChatDialogStore();

	const handleOpen = () => {
		onClosePopover?.();
		openMannerModal("manner");
	};

	const menuItemProps: PopoverMenuItemProps = {
		text: "매너 평가",
		onClick: handleOpen,
		className,
	};

	return <PopoverMenuItem {...menuItemProps} />;
}
