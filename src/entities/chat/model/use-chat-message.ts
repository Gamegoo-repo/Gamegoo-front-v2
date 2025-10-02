import { useSocketMessage } from "@/shared/api/socket";
import { useGamegooSocket } from "@/shared/providers/gamegoo-socket-provider";
import { useChatStore } from "../store";
import type { ChatMessage } from "../types";
import { useReadMessage } from "./use-read-message";

interface ChatMessageEventData {
	data: {
		senderId: number;
		senderName: string | null;
		senderProfileImg: number | null;
		message: string;
		createdAt: string;
		timestamp: number;
		chatroomUuid: string;
	};
}

interface SystemMessageEventData {
	data: {
		senderId: number;
		senderName: string | null;
		senderProfileImg: number | null;
		message: string;
		createdAt: string;
		timestamp: number;
		chatroomUuid: string;
		systemType?: number;
		boardId?: number | null;
	};
}

export const useChatMessage = () => {
	const { isAuthenticated } = useGamegooSocket();
	const {
		addMessage,
		addSystemMessage,
		addMyMessage,
		currentChatroomUuid,
		markAsRead,
	} = useChatStore();
	const readMessageMutation = useReadMessage();

	useSocketMessage<ChatMessageEventData>("chat-message", (eventData) => {
		if (!isAuthenticated) return;

		const { data } = eventData;
		const { chatroomUuid, ...messageData } = data;

		const message: ChatMessage = {
			...messageData,
			senderName: messageData.senderName || undefined,
			senderProfileImg: messageData.senderProfileImg || undefined,
		};

		addMessage(message, chatroomUuid);

		if (currentChatroomUuid === chatroomUuid) {
			markAsRead(chatroomUuid);
			readMessageMutation.mutate({
				chatroomUuid,
				timestamp: message.timestamp,
			});
		}
	});

	useSocketMessage<ChatMessageEventData>(
		"my-message-broadcast-success",
		(eventData) => {
			if (!isAuthenticated) return;

			const { data } = eventData;
			const { chatroomUuid, ...messageData } = data;

			const message: ChatMessage = {
				...messageData,
				senderName: messageData.senderName || undefined,
				senderProfileImg: messageData.senderProfileImg || undefined,
			};

			if (currentChatroomUuid === chatroomUuid) {
				addMyMessage(message, chatroomUuid);
			}
		},
	);

	useSocketMessage<SystemMessageEventData>(
		"chat-system-message",
		(eventData) => {
			if (!isAuthenticated) return;

			const { data } = eventData;
			const { chatroomUuid, ...messageData } = data;

			const message: ChatMessage = {
				...messageData,
				senderName: messageData.senderName || undefined,
				senderProfileImg: messageData.senderProfileImg || undefined,
			};

			addSystemMessage(message, chatroomUuid);
		},
	);

	useSocketMessage<SystemMessageEventData>(
		"manner-system-message",
		(eventData) => {
			if (!isAuthenticated) return;

			const { data } = eventData;
			const { chatroomUuid, ...messageData } = data;

			const message: ChatMessage = {
				...messageData,
				senderName: messageData.senderName || undefined,
				senderProfileImg: messageData.senderProfileImg || undefined,
			};

			addSystemMessage(message, chatroomUuid);

			if (currentChatroomUuid === chatroomUuid) {
				markAsRead(chatroomUuid);
				readMessageMutation.mutate({
					chatroomUuid,
					timestamp: message.timestamp,
				});
			}
		},
	);
};
