import { useChatStore } from "@/entities/chat";
import { useChatDialogStore } from "@/entities/chat/store/use-chat-dialog-store";
import { useReadChatMessage } from "@/features/chat/api/use-read-chat-message";
import type {
	ChatMessageEventData,
	SystemMessageEventData,
} from "@/features/chat/lib/types";
import { useSocketMessage } from "@/shared/api/socket";
import { useGamegooSocket } from "@/shared/providers/gamegoo-socket-provider";

export const useChatMessageSocket = () => {
	const { isAuthenticated } = useGamegooSocket();
	const { incrementUnreadCount, resetUnreadCount } = useChatStore();
	const { mutate: readMessage } = useReadChatMessage();

	useSocketMessage<ChatMessageEventData>("chat-message", (eventData) => {
		if (!isAuthenticated) return;

		const { data } = eventData;
		const { chatroomUuid, timestamp } = data;

		const dialogState = useChatDialogStore.getState();

		const isActiveChatroom =
			(dialogState.isOpen &&
				dialogState.chatDialogType === "chatroom" &&
				dialogState.chatroom?.uuid === chatroomUuid) ||
			(!dialogState.isOpen && dialogState.chatroom?.uuid === chatroomUuid);

		if (isActiveChatroom) {
			resetUnreadCount(chatroomUuid);
			readMessage({ chatroomUuid, timestamp });
		} else {
			incrementUnreadCount(chatroomUuid);
		}
	});

	useSocketMessage<SystemMessageEventData>(
		"chat-system-message",
		(eventData) => {
			if (!isAuthenticated) return;

			const { data } = eventData;
			const { chatroomUuid, timestamp } = data;

			const dialogState = useChatDialogStore.getState();
			const isCurrentChatroom =
				dialogState.isOpen &&
				dialogState.chatDialogType === "chatroom" &&
				dialogState.chatroom?.uuid === chatroomUuid;

			if (isCurrentChatroom) {
				resetUnreadCount(chatroomUuid);
				readMessage({ chatroomUuid, timestamp });
			} else {
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

			const dialogState = useChatDialogStore.getState();
			const isCurrentChatroom =
				dialogState.isOpen &&
				dialogState.chatDialogType === "chatroom" &&
				dialogState.chatroom?.uuid === chatroomUuid;

			if (isCurrentChatroom) {
				resetUnreadCount(chatroomUuid);
				readMessage({ chatroomUuid, timestamp });
			} else {
				incrementUnreadCount(chatroomUuid);
			}
		},
	);
};
