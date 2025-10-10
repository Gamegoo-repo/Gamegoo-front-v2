import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import type { ChatMessage } from "@/entities/chat";
import {
	deduplicateMessages,
	formatMessageDate,
	shouldShowDate,
	shouldShowProfileImage,
	shouldShowTime,
} from "@/features/chat/lib/chatroom-utils";
import { useChatDialogStore } from "@/features/chat/model/store";
import { useChatMessages } from "@/features/chat/model/use-chat-messages";
import { useEnterChatroom } from "@/features/chat/model/use-chatroom-enter";
import { useChatroomSocket } from "@/features/chat/model/use-chatroom-socket";
import ChatroomDateDivider from "./chatroom-date-divider";
import ChatroomFeedbackMessage from "./chatroom-feedback-message";
import ChatroomMessageInput from "./chatroom-message-input";
import ChatroomMyMessage from "./chatroom-my-message";
import ChatroomOpponentMessage from "./chatroom-opponent-message";
import ChatroomSystemMessage from "./chatroom-system-message";

const Chatroom = () => {
	const { chatroom } = useChatDialogStore();
	const chatroomUuid = chatroom?.uuid || null;
	const messagesEndRef = useRef<HTMLDivElement>(null);

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

	const allMessages = deduplicateMessages([...apiMessages, ...socketMessages]);
	const opponentId = enterData?.data?.memberId;

	const renderMessage = useCallback(
		(message: ChatMessage, index: number) => {
			const showTime = shouldShowTime(message, index, allMessages);
			const showProfileImage = shouldShowProfileImage(
				message,
				index,
				allMessages,
			);
			const showDate = shouldShowDate(message, index, allMessages);
			const isLast = index === allMessages.length - 1;
			const isMyMessage = message.senderId !== opponentId;
			const key = `${message.timestamp || 0}-${message.senderId}-${index}`;

			const elements: React.ReactNode[] = [];

			// 날짜 구분선 표시
			if (showDate && message.timestamp) {
				const dateString = formatMessageDate(message.timestamp);
				elements.push(
					<ChatroomDateDivider key={`date-${key}`} date={dateString} />,
				);
			}

			// 메시지 렌더링
			if (message.systemType !== undefined && message.systemType !== null) {
				if (message.systemType === 5) {
					elements.push(
						<ChatroomFeedbackMessage key={key} onEvaluate={() => {}} />,
					);
				} else {
					elements.push(
						<ChatroomSystemMessage
							key={key}
							message={message.message || ""}
							href={message.boardId ? `/board/${message.boardId}` : undefined}
						/>,
					);
				}
			} else if (isMyMessage) {
				elements.push(
					<ChatroomMyMessage
						key={key}
						message={message}
						showTime={showTime}
						isLast={isLast}
						isAnimated={false}
					/>,
				);
			} else {
				elements.push(
					<ChatroomOpponentMessage
						key={key}
						message={message}
						showTime={showTime}
						showProfileImage={showProfileImage}
					/>,
				);
			}

			return elements;
		},
		[allMessages, opponentId],
	);

	const renderMessages = useMemo(() => {
		return allMessages.flatMap((message, index) =>
			renderMessage(message, index),
		);
	}, [allMessages, renderMessage]);

	// 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
	useLayoutEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
	}, [allMessages]);

	if (!chatroomUuid) return null;

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
		<div className="flex flex-col h-[calc(687px-90px)]">
			<div className="flex-1 flex flex-col px-2 overflow-y-auto min-h-0 mb-[138px] scrollbar-hide">
				{allMessages.length === 0 ? (
					<div className="flex items-center justify-center h-full text-gray-500">
						메시지가 없습니다. 첫 메시지를 보내보세요!
					</div>
				) : (
					<div className="flex flex-col">
						{renderMessages}
						<div ref={messagesEndRef} />
					</div>
				)}
			</div>
			<div className="absolute bottom-0 left-0 right-0">
				<ChatroomMessageInput />
			</div>
		</div>
	);
};

export default Chatroom;
