import { useEffect, useState } from "react";
import type { ChatMessage } from "@/entities/chat";
import { useSocketMessage } from "@/shared/api/socket";
import { useGamegooSocket } from "@/shared/providers/gamegoo-socket-provider";
import type {
	ChatMessageEventData,
	SystemMessageEventData,
} from "../lib/types";

export const useChatroomSocket = (chatroomUuid: string | null) => {
	const [socketMessages, setSocketMessages] = useState<ChatMessage[]>([]);
	const { isAuthenticated } = useGamegooSocket();

	useEffect(() => {
		setSocketMessages([]);
	}, [chatroomUuid]);

	useSocketMessage<ChatMessageEventData>("chat-message", (eventData) => {
		if (!isAuthenticated || !chatroomUuid) return;

		const { data } = eventData;
		if (data.chatroomUuid !== chatroomUuid) return;

		const { chatroomUuid: _, ...messageData } = data;
		const message: ChatMessage = {
			...messageData,
			senderName: messageData.senderName || undefined,
			senderProfileImg: messageData.senderProfileImg || undefined,
		};

		setSocketMessages((prev) => [...prev, message]);
	});

	useSocketMessage<ChatMessageEventData>(
		"my-message-broadcast-success",
		(eventData) => {
			if (!isAuthenticated || !chatroomUuid) return;

			const { data } = eventData;
			if (data.chatroomUuid !== chatroomUuid) return;

			const { chatroomUuid: _, ...messageData } = data;
			const message: ChatMessage = {
				...messageData,
				senderName: messageData.senderName || undefined,
				senderProfileImg: messageData.senderProfileImg || undefined,
			};

			setSocketMessages((prev) => [...prev, message]);
		},
	);

	useSocketMessage<SystemMessageEventData>(
		"chat-system-message",
		(eventData) => {
			if (!isAuthenticated || !chatroomUuid) return;

			const { data } = eventData;
			if (data.chatroomUuid !== chatroomUuid) return;

			const { chatroomUuid: _, ...messageData } = data;
			const message: ChatMessage = {
				...messageData,
				senderName: messageData.senderName || undefined,
				senderProfileImg: messageData.senderProfileImg || undefined,
			};

			setSocketMessages((prev) => [...prev, message]);
		},
	);

	useSocketMessage<SystemMessageEventData>(
		"manner-system-message",
		(eventData) => {
			if (!isAuthenticated || !chatroomUuid) return;

			const { data } = eventData;
			if (data.chatroomUuid !== chatroomUuid) return;

			const { chatroomUuid: _, ...messageData } = data;
			const message: ChatMessage = {
				...messageData,
				senderName: messageData.senderName || undefined,
				senderProfileImg: messageData.senderProfileImg || undefined,
			};

			setSocketMessages((prev) => [...prev, message]);
		},
	);

	return socketMessages;
};
