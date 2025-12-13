import { useEffect, useState } from "react";
import type { ChatMessage } from "@/entities/chat";
import { useSocketMessage } from "@/shared/api/socket";
import { useGamegooSocket } from "@/shared/providers/gamegoo-socket-provider";
import type {
	ChatMessageEventData,
	SystemMessageEventData,
} from "../lib/types";

const parseSystemData = (data: unknown): Partial<ChatMessage> => {
	const rawSystemType =
		(data as { systemType?: number | string }).systemType ??
		(data as { system?: { flag?: number | string } }).system?.flag;
	const systemType =
		typeof rawSystemType === "string"
			? Number.parseInt(rawSystemType, 10)
			: rawSystemType;
	const boardId =
		(data as { boardId?: number | null }).boardId ??
		(data as { system?: { boardId?: number | null } }).system?.boardId ??
		null;

	return {
		...(typeof systemType === "number" && { systemType }),
		...(typeof boardId !== "undefined" && { boardId }),
	};
};

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
			...parseSystemData(data),
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
				...parseSystemData(data),
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
