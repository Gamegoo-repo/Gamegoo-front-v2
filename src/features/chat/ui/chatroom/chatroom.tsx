import { type ChatMessage, useChatStore } from "@/entities/chat";
import { useChatDialogStore } from "@/features/chat/model/store";
import { useChatMessages } from "@/features/chat/model/use-chat-messages";
import ChatroomFeedbackMessage from "./chatroom-feedback-message";
import ChatroomMyMessage from "./chatroom-my-message";
import ChatroomOpponentMessage from "./chatroom-opponent-message";
import ChatroomSystemMessage from "./chatroom-system-message";

const Chatroom = () => {
	const { chatroom } = useChatDialogStore();
	const { getChatroomMessages } = useChatStore();

	const chatroomUuid = chatroom?.uuid || null;

	const {
		messages: apiMessages,
		isLoading,
		error,
	} = useChatMessages(chatroomUuid);

	const realtimeMessages = chatroomUuid
		? getChatroomMessages(chatroomUuid)
		: [];

	const allMessages: ChatMessage[] = [
		...apiMessages.map((msg) => ({
			...msg,
			senderId: msg.senderId || 0,
			senderName: msg.senderName || undefined,
			senderProfileImg: msg.senderProfileImg || undefined,
			message: msg.message || "",
			createdAt: msg.createdAt || "",
			timestamp: msg.timestamp || 0,
		})),
		...realtimeMessages,
	].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

	const currentUserId = 8;

	const shouldShowTime = (message: ChatMessage, index: number) => {
		if (index === allMessages.length - 1) return true;

		const nextMessage = allMessages[index + 1];
		if (!nextMessage) return true;

		if (nextMessage.senderId !== message.senderId) return true;

		const timeDiff = (nextMessage.timestamp || 0) - (message.timestamp || 0);
		return timeDiff > 60000;
	};

	const shouldShowProfileImage = (message: ChatMessage, index: number) => {
		if (index === 0) return true;

		const prevMessage = allMessages[index - 1];
		if (!prevMessage) return true;

		return prevMessage.senderId !== message.senderId;
	};

	const renderMessage = (message: ChatMessage, index: number) => {
		const showTime = shouldShowTime(message, index);
		const showProfileImage = shouldShowProfileImage(message, index);
		const isLast = index === allMessages.length - 1;
		const isMyMessage = message.senderId === currentUserId;
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

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full text-gray-500">
				메시지를 불러오는 중...
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-full text-red-500">
				메시지를 불러오는데 실패했습니다.
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 flex flex-col px-2 gap-1 overflow-y-auto">
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
