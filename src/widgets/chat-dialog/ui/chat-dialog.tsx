import type { AdjustPositionCallback } from "@/features/draggable-dialog";
import { DraggableDialog } from "@/features/draggable-dialog";

interface ChatDialogProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

function ChatDialog({ isOpen, onClose, children }: ChatDialogProps) {
	// 채팅 전용 경계 제한 로직
	const adjustChatPosition: AdjustPositionCallback = ({ top, left }) => {
		const chatWidth = 420;
		const chatHeight = 687;
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		let topValue = parseInt(top, 10);
		let leftValue = parseInt(left, 10);

		if (topValue < 0) topValue = 0;
		if (topValue + chatHeight > viewportHeight) {
			topValue = viewportHeight - chatHeight;
		}

		if (leftValue < 0) leftValue = 0;
		if (viewportWidth - leftValue < chatWidth) {
			leftValue = viewportWidth - chatWidth;
		}

		return { top: `${topValue}px`, left: `${leftValue}px` };
	};

	return (
		<DraggableDialog
			isOpen={isOpen}
			onOpenChange={(open) => !open && onClose()}
			title="채팅"
			width={420}
			height={687}
			adjustPositionCallback={adjustChatPosition}
			showCloseButton={true}
		>
			{children}
		</DraggableDialog>
	);
}

export { ChatDialog };
