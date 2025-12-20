import { useChatDialogStore } from "@/entities/chat";
import { ChatroomHeader, useEnterChatroom } from "@/features/chat";
import {
	type AdjustPositionCallback,
	DraggableDialog,
} from "@/features/draggable-dialog";
import FloatingChatDialogContent from "./floating-chat-dialog-content";
import FloatingChatDialogTabs from "./floating-chat-dialog-tabs";

const FloatingChatDialog = () => {
	const { isOpen, closeDialog, chatDialogType, chatroom } =
		useChatDialogStore();
	const chatroomUuid = chatroom?.uuid || null;
	const {
		data: enterData,
		isLoading: isEntering,
		error: enterError,
	} = useEnterChatroom(chatroomUuid, {
		enabled: chatDialogType === "chatroom",
	});

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

	return (
		<DraggableDialog
			isOpen={isOpen}
			variant={chatDialogType === "chatroom" ? "violet" : "white"}
			headerComponent={
				chatDialogType === "chatroom" ? (
					<ChatroomHeader enterData={enterData} />
				) : undefined
			}
			onOpenChange={(open) => !open && closeDialog()}
			title="메신저"
			width={420}
			height={687}
			adjustPositionCallback={adjustChatPosition}
		>
			<FloatingChatDialogTabs />
			<FloatingChatDialogContent
				enterData={enterData}
				isEntering={isEntering}
				enterError={enterError}
			/>
		</DraggableDialog>
	);
};

export default FloatingChatDialog;
