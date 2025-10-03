import { useChatDialogStore } from "@/features/chat/model/store";
import { useReadChatMessage } from "@/features/chat/model/use-read-chat-message";
import { useSocketMessage } from "@/shared/api/socket";
import { useGamegooSocket } from "@/shared/providers/gamegoo-socket-provider";
import { useChatStore } from "../store";

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
	const { incrementUnreadCount, markAsRead } = useChatStore();
	const { mutate: readMessage } = useReadChatMessage();

	useSocketMessage<ChatMessageEventData>("chat-message", (eventData) => {
		if (!isAuthenticated) return;

		const { data } = eventData;
		const { chatroomUuid, timestamp } = data;

		// 현재 입장한 채팅방인지 확인
		const currentChatroom = useChatDialogStore.getState().chatroom;
		if (currentChatroom?.uuid === chatroomUuid) {
			// 현재 채팅방의 메시지는 읽음 처리
			markAsRead(chatroomUuid);
			readMessage({ chatroomUuid, timestamp });
		} else {
			// 다른 채팅방의 메시지는 unread 카운트 증가
			incrementUnreadCount(chatroomUuid);
		}
	});

	useSocketMessage<SystemMessageEventData>(
		"chat-system-message",
		(eventData) => {
			if (!isAuthenticated) return;

			const { data } = eventData;
			const { chatroomUuid, timestamp } = data;

			// 현재 입장한 채팅방인지 확인
			const currentChatroom = useChatDialogStore.getState().chatroom;
			if (currentChatroom?.uuid === chatroomUuid) {
				// 현재 채팅방의 메시지는 읽음 처리
				markAsRead(chatroomUuid);
				readMessage({ chatroomUuid, timestamp });
			} else {
				// 다른 채팅방의 메시지는 unread 카운트 증가
				incrementUnreadCount(chatroomUuid);
			}
		},
	);

	useSocketMessage<SystemMessageEventData>(
		"manner-system-message",
		(eventData) => {
			if (!isAuthenticated) return;

			const { data } = eventData;
			const { chatroomUuid, timestamp } = data;

			// 현재 입장한 채팅방인지 확인
			const currentChatroom = useChatDialogStore.getState().chatroom;
			if (currentChatroom?.uuid === chatroomUuid) {
				// 현재 채팅방의 메시지는 읽음 처리
				markAsRead(chatroomUuid);
				readMessage({ chatroomUuid, timestamp });
			} else {
				// 다른 채팅방의 메시지는 unread 카운트 증가
				incrementUnreadCount(chatroomUuid);
			}
		},
	);
};
