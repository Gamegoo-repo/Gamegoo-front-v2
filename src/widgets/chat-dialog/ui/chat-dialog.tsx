import { useState } from "react";
import type { AdjustPositionCallback } from "@/features/draggable-dialog";
import { DraggableDialog } from "@/features/draggable-dialog";
import { tokenManager } from "@/shared/api";
import { LoginRequiredModal } from "@/widgets/login-required-modal";
import ChatContent from "./chat-content";
import ChatTabs from "./chat-tabs";

interface ChatDialogProps {
	isOpen: boolean;
	onClose: () => void;
}

const TABS = ["친구 목록", "채팅방"] as const;

function ChatDialog({ isOpen, onClose }: ChatDialogProps) {
	const [activeTab, setActiveTab] = useState(0);

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

	if (!isOpen) {
		return null;
	}

	if (!tokenManager.getAccessToken()) {
		return <LoginRequiredModal isOpen={isOpen} onClose={onClose} />;
	}

	return (
		<DraggableDialog
			isOpen={isOpen}
			onOpenChange={(open) => !open && onClose()}
			title="메신저"
			width={420}
			height={687}
			adjustPositionCallback={adjustChatPosition}
			showCloseButton={true}
		>
			<ChatTabs tabs={TABS} activeTab={activeTab} onTabClick={setActiveTab} />
			<ChatContent activeTab={activeTab} />
		</DraggableDialog>
	);
}

export default ChatDialog;
