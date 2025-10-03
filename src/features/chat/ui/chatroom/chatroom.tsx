import type { ChatMessage } from "@/entities/chat";
import {
	deduplicateMessages,
	shouldShowProfileImage,
	shouldShowTime,
} from "@/features/chat/lib/chatroom-utils";
import { useChatDialogStore } from "@/features/chat/model/store";
import { useChatMessages } from "@/features/chat/model/use-chat-messages";
import { useEnterChatroom } from "@/features/chat/model/use-chatroom-enter";
import { useChatroomSocket } from "@/features/chat/model/use-chatroom-socket";
import ChatroomFeedbackMessage from "./chatroom-feedback-message";
import ChatroomMyMessage from "./chatroom-my-message";
import ChatroomOpponentMessage from "./chatroom-opponent-message";
import ChatroomSystemMessage from "./chatroom-system-message";

const Chatroom = () => {
	const { chatroom } = useChatDialogStore();
	const chatroomUuid = chatroom?.uuid || null;

	const {
		messages: apiMessages,
		isLoading,
		error,
	} = useChatMessages(chatroomUuid);

	const socketMessages = useChatroomSocket(chatroomUuid);
	const {
		data: enterData,
		isLoading: isEntering,
		error: enterError,
	} = useEnterChatroom(chatroomUuid);

	if (!chatroomUuid) return;

	const allMessages = deduplicateMessages([...apiMessages, ...socketMessages]);

	const opponentId = enterData?.data?.memberId;

	const renderMessage = (message: ChatMessage, index: number) => {
		const showTime = shouldShowTime(message, index, allMessages);
		const showProfileImage = shouldShowProfileImage(
			message,
			index,
			allMessages,
		);
		const isLast = index === allMessages.length - 1;
		const isMyMessage = message.senderId !== opponentId;
		const key = `${message.timestamp || 0}-${index}`;

		if (message.systemType !== undefined && message.systemType !== null) {
			if (message.systemType === 5) {
				return <ChatroomFeedbackMessage key={key} onEvaluate={() => {}} />;
			}

			return (
				<ChatroomSystemMessage
					key={key}
					message={message.message || ""}
					href={message.boardId ? `/board/${message.boardId}` : undefined}
				/>
			);
		}

		if (isMyMessage) {
			return (
				<ChatroomMyMessage
					key={key}
					message={message}
					showTime={showTime}
					isLast={isLast}
					isAnimated={false}
				/>
			);
		}

		return (
			<ChatroomOpponentMessage
				key={key}
				message={message}
				showTime={showTime}
				showProfileImage={showProfileImage}
			/>
		);
	};

	if (isLoading || isEntering) {
		return (
			<div className="flex items-center justify-center h-full text-gray-500">
				{isEntering ? "채팅방에 입장하는 중..." : "메시지를 불러오는 중..."}
			</div>
		);
	}

	if (error || enterError) {
		return (
			<div className="flex items-center justify-center h-full text-red-500">
				{enterError
					? "채팅방 입장에 실패했습니다."
					: "메시지를 불러오는데 실패했습니다."}
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 flex flex-col px-2 overflow-y-auto">
				{allMessages.length === 0 ? (
					<div className="flex items-center justify-center h-full text-gray-500">
						메시지가 없습니다. 첫 메시지를 보내보세요!
					</div>
				) : (
					allMessages.map((message, index) => renderMessage(message, index))
				)}
			</div>
		</div>
	);
};

export default Chatroom;
