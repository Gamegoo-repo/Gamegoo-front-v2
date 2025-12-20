import type { FC } from "react";
import { useChatDialogStore } from "@/entities/chat";
import { Chatroom, ChatroomList } from "@/features/chat";
import FriendList from "@/features/friend/ui/friend-list";
import type { ApiResponseEnterChatroomResponse } from "@/shared/api";

interface FloatingChatDialogContentProps {
	enterData?: ApiResponseEnterChatroomResponse;
	isEntering?: boolean;
	enterError?: unknown;
}

const FloatingChatDialogContent: FC<FloatingChatDialogContentProps> = ({
	enterData,
	isEntering,
	enterError,
}) => {
	const { chatDialogType } = useChatDialogStore();

	if (chatDialogType === "friend-list") {
		return <FriendList />;
	}

	if (chatDialogType === "chatroom-list") {
		return <ChatroomList />;
	}

	if (chatDialogType === "chatroom") {
		return (
			<Chatroom
				enterData={enterData}
				isEntering={isEntering}
				enterError={enterError}
			/>
		);
	}

	return null;
};

export default FloatingChatDialogContent;
