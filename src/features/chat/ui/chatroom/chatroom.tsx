import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { type ChatMessage, useChatDialogStore } from "@/entities/chat";
import {
	deduplicateMessages,
	formatMessageDate,
	shouldShowDate,
	shouldShowProfileImage,
	shouldShowTime,
	useChatMessage,
	useChatroomSocket,
	useEnterChatroom,
} from "@/features/chat";
import { useInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";
import {
	ChatroomDateDivider,
	ChatroomFeedbackMessage,
	ChatroomMessageInput,
	ChatroomMyMessage,
	ChatroomOpponentMessage,
	ChatroomSystemMessage,
} from "./";

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
					<div className="flex flex-col items-center justify-center h-full px-4">
						<div className="text-center">
							<p className="text-gray-700 mb-2 regular-16">
								첫 메시지를 보내보세요!
							</p>
							<p className="text-gray-700 regular-16">대화를 시작해보세요.</p>
						</div>
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
