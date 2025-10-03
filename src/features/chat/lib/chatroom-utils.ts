import type { ChatMessage } from "@/entities/chat";

/**
 * API에서 받은 메시지의 타입 (정규화 전)
 */
export type ApiMessage = Partial<ChatMessage> & {
	senderId?: number;
	senderName?: string;
	senderProfileImg?: number | string; // API에서는 number, 정규화 후에는 string
	message?: string;
	createdAt?: string;
	timestamp?: number;
};

/**
 * 메시지 데이터를 정규화합니다.
 * API에서 받은 메시지의 필수 필드들을 기본값으로 채웁니다.
 */
export const normalizeApiMessage = (msg: ApiMessage): ChatMessage => ({
	...msg,
	senderId: msg.senderId || 0,
	senderName: msg.senderName || undefined,
	senderProfileImg: msg.senderProfileImg || undefined,
	message: msg.message || "",
	createdAt: msg.createdAt || "",
	timestamp: msg.timestamp || 0,
});

/**
 * API 메시지 배열을 정규화합니다.
 */
export const normalizeApiMessages = (
	apiMessages: ApiMessage[],
): ChatMessage[] => apiMessages.map(normalizeApiMessage);

export const deduplicateMessages = (messages: ChatMessage[]): ChatMessage[] => {
	return messages
		.filter((message, index, arr) => {
			const firstIndex = arr.findIndex(
				(m) =>
					m.timestamp === message.timestamp &&
					m.senderId === message.senderId &&
					m.message === message.message,
			);
			return firstIndex === index;
		})
		.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
};

export const shouldShowDate = (
	message: ChatMessage,
	index: number,
	allMessages: ChatMessage[],
): boolean => {
	if (index === 0) return true;

	const currentDate = new Date(message.timestamp || 0);
	const previousDate = new Date(allMessages[index - 1].timestamp || 0);

	return (
		currentDate.getDate() !== previousDate.getDate() ||
		currentDate.getMonth() !== previousDate.getMonth() ||
		currentDate.getFullYear() !== previousDate.getFullYear()
	);
};

export const formatMessageDate = (timestamp: number): string => {
	const date = new Date(timestamp);
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	if (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	) {
		return "오늘";
	}

	if (
		date.getDate() === yesterday.getDate() &&
		date.getMonth() === yesterday.getMonth() &&
		date.getFullYear() === yesterday.getFullYear()
	) {
		return "어제";
	}

	return date.toLocaleDateString("ko-KR", {
		month: "long",
		day: "numeric",
		weekday: "short",
	});
};

/**
 * API 메시지와 실시간 메시지를 합치고 중복을 제거합니다.
 */
export const mergeAndDeduplicateMessages = (
	apiMessages: ApiMessage[],
	realtimeMessages: ChatMessage[],
): ChatMessage[] => {
	const normalizedApiMessages = normalizeApiMessages(apiMessages);
	const allMessagesWithDuplicates = [
		...normalizedApiMessages,
		...realtimeMessages,
	];

	return deduplicateMessages(allMessagesWithDuplicates);
};

/**
 * 메시지에 시간을 표시해야 하는지 결정합니다.
 * 다음 메시지와의 시간 차이가 1분(60000ms) 이상이거나,
 * 다음 메시지의 발신자가 다르거나, 마지막 메시지인 경우 true를 반환합니다.
 */
export const shouldShowTime = (
	message: ChatMessage,
	index: number,
	allMessages: ChatMessage[],
): boolean => {
	if (index === allMessages.length - 1) return true;

	const nextMessage = allMessages[index + 1];
	if (!nextMessage) return true;

	if (nextMessage.senderId !== message.senderId) return true;

	const timeDiff = (nextMessage.timestamp || 0) - (message.timestamp || 0);
	return timeDiff > 60000;
};

/**
 * 메시지에 프로필 이미지를 표시해야 하는지 결정합니다.
 * 첫 번째 메시지이거나, 이전 메시지의 발신자가 다른 경우 true를 반환합니다.
 */
export const shouldShowProfileImage = (
	message: ChatMessage,
	index: number,
	allMessages: ChatMessage[],
): boolean => {
	if (index === 0) return true;

	const prevMessage = allMessages[index - 1];
	if (!prevMessage) return true;

	return prevMessage.senderId !== message.senderId;
};
