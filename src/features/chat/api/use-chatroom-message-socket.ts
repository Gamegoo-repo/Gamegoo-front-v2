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
		const rawSystemType =
			(data as unknown as { systemType?: number | string }).systemType ??
			(data as unknown as { system?: { flag?: number | string } }).system?.flag;
		const systemType =
			typeof rawSystemType === "string"
				? Number.parseInt(rawSystemType, 10)
				: rawSystemType;
		const boardId =
			(data as unknown as { boardId?: number | null }).boardId ??
			(data as unknown as { system?: { boardId?: number | null } }).system
				?.boardId ??
			null;

		const message: ChatMessage = {
			...messageData,
			senderName: messageData.senderName || undefined,
			senderProfileImg: messageData.senderProfileImg || undefined,
			...(typeof systemType === "number" && { systemType }),
			...(typeof boardId !== "undefined" && { boardId }),
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
			const rawSystemType =
				(data as unknown as { systemType?: number | string }).systemType ??
				(data as unknown as { system?: { flag?: number | string } }).system
					?.flag;
			const systemType =
				typeof rawSystemType === "string"
					? Number.parseInt(rawSystemType, 10)
					: rawSystemType;
			const boardId =
				(data as unknown as { boardId?: number | null }).boardId ??
				(
					data as unknown as {
						system?: { boardId?: number | null };
					}
				).system?.boardId ??
				null;

			const message: ChatMessage = {
				...messageData,
				senderName: messageData.senderName || undefined,
				senderProfileImg: messageData.senderProfileImg || undefined,
				...(typeof systemType === "number" && { systemType }),
				...(typeof boardId !== "undefined" && { boardId }),
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
			// eslint-disable-next-line no-console
			console.log("[socket] manner-system-message", { raw: data });
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
