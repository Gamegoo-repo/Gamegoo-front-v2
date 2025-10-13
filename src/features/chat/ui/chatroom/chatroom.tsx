import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ChatMessage } from "@/entities/chat";
import { useChatDialogStore } from "@/entities/chat/store/use-chat-dialog-store";
import { useChatMessage } from "@/features/chat/api/use-chat-message";
import { useEnterChatroom } from "@/features/chat/api/use-chatroom-enter";
import { useChatroomSocket } from "@/features/chat/api/use-chatroom-message-socket";
import {
	deduplicateMessages,
	formatMessageDate,
	shouldShowDate,
	shouldShowProfileImage,
	shouldShowTime,
} from "@/features/chat/lib/chatroom-utils";
import { useInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";
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
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [isUserScrolling, setIsUserScrolling] = useState(false);
	const [hasInitiallyScrolled, setHasInitiallyScrolled] = useState(false);
	const [previousMessageCount, setPreviousMessageCount] = useState(0);

	const {
		messages: apiMessages,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useChatMessage(chatroomUuid);

	const socketMessages = useChatroomSocket(chatroomUuid);
	const {
		data: enterData,
		isLoading: isEntering,
		error: enterError,
	} = useEnterChatroom(chatroomUuid);

	const allMessages = deduplicateMessages([...apiMessages, ...socketMessages]);
	const opponentId = enterData?.data?.memberId;

	const { sentinelRef } = useInfiniteScroll({
		hasNextPage: !!hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
		threshold: 100,
	});

	useLayoutEffect(() => {
		setHasInitiallyScrolled(false);
		setIsUserScrolling(false);
		setPreviousMessageCount(0);
	}, [chatroomUuid]);

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

			if (showDate && message.timestamp) {
				const dateString = formatMessageDate(message.timestamp);
				elements.push(
					<ChatroomDateDivider key={`date-${key}`} date={dateString} />,
				);
			}

			if (message.systemType !== undefined && message.systemType !== null) {
				if (message.systemType === 5) {
					elements.push(
						<div key={key} data-message-index={index}>
							<ChatroomFeedbackMessage onEvaluate={() => {}} />
						</div>,
					);
				} else {
					elements.push(
						<div key={key} data-message-index={index}>
							<ChatroomSystemMessage
								message={message.message || ""}
								href={message.boardId ? `/board/${message.boardId}` : undefined}
							/>
						</div>,
					);
				}
			} else if (isMyMessage) {
				elements.push(
					<div key={key} data-message-index={index}>
						<ChatroomMyMessage
							message={message}
							showTime={showTime}
							isLast={isLast}
							isAnimated={false}
						/>
					</div>,
				);
			} else {
				elements.push(
					<div key={key} data-message-index={index}>
						<ChatroomOpponentMessage
							message={message}
							showTime={showTime}
							showProfileImage={showProfileImage}
						/>
					</div>,
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

	const handleScroll = useCallback(() => {
		if (!scrollContainerRef.current) return;

		const { scrollTop, scrollHeight, clientHeight } =
			scrollContainerRef.current;
		const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;

		setIsUserScrolling(!isNearBottom);
	}, []);

	useLayoutEffect(() => {
		if (!scrollContainerRef.current || !isUserScrolling) return;

		const container = scrollContainerRef.current;
		const currentMessageCount = apiMessages.length;

		if (
			currentMessageCount > previousMessageCount &&
			previousMessageCount > 0
		) {
			const newMessageCount = currentMessageCount - previousMessageCount;

			requestAnimationFrame(() => {
				const messageElements = container.querySelectorAll(
					"[data-message-index]",
				);
				if (messageElements.length >= newMessageCount) {
					const firstNewMessageElement = messageElements[
						newMessageCount - 1
					] as HTMLElement;
					if (firstNewMessageElement) {
						firstNewMessageElement.scrollIntoView({
							behavior: "instant",
							block: "start",
						});
					}
				}
			});
		}

		setPreviousMessageCount(currentMessageCount);
	}, [apiMessages.length, isUserScrolling, previousMessageCount]);

	useLayoutEffect(() => {
		if (
			!isLoading &&
			!isEntering &&
			allMessages.length > 0 &&
			!hasInitiallyScrolled
		) {
			messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
			setHasInitiallyScrolled(true);
		}
	}, [isLoading, isEntering, allMessages.length, hasInitiallyScrolled]);

	useLayoutEffect(() => {
		if (!isUserScrolling && socketMessages.length > 0) {
			messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
		}
	}, [socketMessages.length, isUserScrolling]);

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
			<div
				ref={scrollContainerRef}
				className="flex-1 flex flex-col px-2 overflow-y-auto min-h-0 mb-[138px] scrollbar-hide"
				onScroll={handleScroll}
			>
				{allMessages.length === 0 ? (
					<div className="flex items-center justify-center h-full text-gray-500">
						메시지가 없습니다. 첫 메시지를 보내보세요!
					</div>
				) : (
					<div className="flex flex-col">
						{hasNextPage && (
							<div
								ref={sentinelRef}
								className="h-1"
								style={{ minHeight: "1px" }}
							/>
						)}
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
