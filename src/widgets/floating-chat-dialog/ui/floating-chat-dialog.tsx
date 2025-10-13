import { useChatDialogStore } from "@/entities/chat/store/use-chat-dialog-store";
import ChatroomHeader from "@/features/chat/ui/chatroom/chatroom-header";
import {
	type AdjustPositionCallback,
	DraggableDialog,
} from "@/features/draggable-dialog";
import { tokenManager } from "@/shared/api";
import { LoginRequiredModal } from "@/widgets/login-required-modal";
import FloatingChatDialogContent from "./floating-chat-dialog-content";
import FloatingChatDialogTabs from "./floating-chat-dialog-tabs";

const FloatingChatDialog = () => {
	const { isOpen, closeDialog, chatDialogType } = useChatDialogStore();

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
		return <LoginRequiredModal isOpen={isOpen} onClose={closeDialog} />;
	}

	return (
		<DraggableDialog
			isOpen={isOpen}
			variant={chatDialogType === "chatroom" ? "violet" : "white"}
			headerComponent={
				chatDialogType === "chatroom" ? <ChatroomHeader /> : undefined
			}
			onOpenChange={(open) => !open && closeDialog()}
			title="메신저"
			width={420}
			height={687}
			adjustPositionCallback={adjustChatPosition}
		>
			<FloatingChatDialogTabs />
			<FloatingChatDialogContent />
		</DraggableDialog>
	);
};

export default FloatingChatDialog;
