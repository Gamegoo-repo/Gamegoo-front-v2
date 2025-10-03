import { useEffect, useState } from "react";
import type { ChatMessage } from "@/entities/chat";
import { useSocketMessage } from "@/shared/api/socket";
import { useGamegooSocket } from "@/shared/providers/gamegoo-socket-provider";

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

export const useChatroomSocket = (chatroomUuid: string | null) => {
	const [socketMessages, setSocketMessages] = useState<ChatMessage[]>([]);
	const { isAuthenticated } = useGamegooSocket();

	// 채팅방이 변경될 때 소켓 메시지 초기화
	useEffect(() => {
		setSocketMessages([]);
	}, [chatroomUuid]);

	// 일반 메시지 이벤트
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

	// 내 메시지 브로드캐스트 성공 이벤트
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

	// 채팅 시스템 메시지 이벤트
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

	// 매너 시스템 메시지 이벤트
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
