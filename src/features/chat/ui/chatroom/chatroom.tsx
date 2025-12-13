import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	type ChatMessage,
	useChatDialogStore,
	useChatStore,
} from "@/entities/chat";
import {
	deduplicateMessages,
	formatMessageDate,
	shouldShowDate,
	shouldShowProfileImage,
	shouldShowTime,
	useChatMessage,
	useChatroomSocket,
	useEnterChatroom,
	useReadChatMessage,
} from "@/features/chat";
import MannerEvaluationModal from "@/features/manner/ui/manner-evaluation-modal";
import MannerSelectModal from "@/features/manner/ui/manner-select-modal";
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
	const [isMannerSelectOpen, setIsMannerSelectOpen] = useState(false);
	const [isMannerEvalOpen, setIsMannerEvalOpen] = useState(false);
	const [mannerType, setMannerType] = useState<"manner" | "badManner">(
		"manner",
	);

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
	const { resetUnreadCount } = useChatStore();
	const { mutate: readMessage } = useReadChatMessage();

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

	useEffect(() => {
		if (!chatroomUuid) return;
		if (!enterData) return;
		resetUnreadCount(chatroomUuid);
		readMessage({ chatroomUuid });
	}, [chatroomUuid, enterData]);

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
				// 5: 매너평가 시스템 메시지
				if (message.systemType === 5) {
					elements.push(
						<div key={key} data-message-index={index}>
							<ChatroomFeedbackMessage
								onEvaluate={() => {
									setIsMannerSelectOpen(true);
								}}
							/>
						</div>,
					);
				} else {
					// 기타 시스템 메시지: 매칭성공 포함 모든 시스템 메시지를 표시
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
			<div className="flex h-full items-center justify-center text-gray-500">
				{isEntering ? "채팅방에 입장하는 중..." : "메시지를 불러오는 중..."}
			</div>
		);
	}

	if (error || enterError) {
		return (
			<div className="flex h-full items-center justify-center text-red-500">
				{enterError
					? "채팅방 입장에 실패했습니다."
					: "메시지를 불러오는데 실패했습니다."}
			</div>
		);
	}

	return (
		<div className="flex h-[calc(var(--dialog-height)-var(--chatroom-header-height)-var(--chatroom-input-height))] flex-col">
			<div
				ref={scrollContainerRef}
				className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto px-2"
				onScroll={handleScroll}
			>
				{allMessages.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center px-4">
						<div className="text-center">
							<p className="regular-16 mb-2 text-gray-700">
								첫 메시지를 보내보세요!
							</p>
							<p className="regular-16 text-gray-700">대화를 시작해보세요.</p>
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
			<div className="absolute right-0 bottom-0 left-0">
				<ChatroomMessageInput />
			</div>
			{/* Manner Select Modal */}
			<MannerSelectModal
				isOpen={isMannerSelectOpen}
				onClose={() => setIsMannerSelectOpen(false)}
				onConfirm={(type) => {
					setMannerType(type);
					setIsMannerEvalOpen(true);
				}}
			/>
			{/* Manner Evaluation Modal */}
			<MannerEvaluationModal
				isOpen={isMannerEvalOpen}
				onClose={() => setIsMannerEvalOpen(false)}
				memberId={opponentId}
				type={mannerType}
			/>
		</div>
	);
};

export default Chatroom;
