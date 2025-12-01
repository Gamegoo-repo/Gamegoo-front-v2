import { useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "@/entities/chat";
import { useChatDialogStore } from "@/entities/chat/store/use-chat-dialog-store";
import { useReadChatMessage } from "@/features/chat/api/use-read-chat-message";
import type {
	ChatMessageEventData,
	SystemMessageEventData,
} from "@/features/chat/lib/types";
import { api } from "@/shared/api";
import { useSocketMessage } from "@/shared/api/socket";
import { useGamegooSocket } from "@/shared/providers/gamegoo-socket-provider";

export const useChatMessageSocket = () => {
	const { isAuthenticated } = useGamegooSocket();
	const { resetUnreadCount } = useChatStore();
	const { mutate: readMessage } = useReadChatMessage();
	const queryClient = useQueryClient();

	const ensureChatroomExists = async (chatroomUuid: string) => {
		const { chatrooms, setChatrooms } = useChatStore.getState();
		const exists = chatrooms.some((r) => r.uuid === chatroomUuid);
		if (exists) return;
		try {
			const response = await api.private.chat.getChatroom();
			const list = response.data?.data?.chatroomResponseList || [];
			setChatrooms(list);
		} catch (_e) {
			// ignore network errors here; fallback to invalidation
		} finally {
			void queryClient.invalidateQueries({ queryKey: ["chatrooms"] });
		}
	};

	useSocketMessage<ChatMessageEventData>("chat-message", (eventData) => {
		if (!isAuthenticated) return;

		const { data } = eventData;
		const { chatroomUuid, timestamp } = data;

		const dialogState = useChatDialogStore.getState();

		const isActiveChatroom =
			dialogState.isOpen &&
			dialogState.chatDialogType === "chatroom" &&
			dialogState.chatroom?.uuid === chatroomUuid;

		void ensureChatroomExists(chatroomUuid);

		if (isActiveChatroom) {
			resetUnreadCount(chatroomUuid);
			readMessage({ chatroomUuid, timestamp });
		} else {
			// rely on server-sent 'unread_count_update' to set unread count
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

			void ensureChatroomExists(chatroomUuid);

			if (isCurrentChatroom) {
				resetUnreadCount(chatroomUuid);
				readMessage({ chatroomUuid, timestamp });
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

			void ensureChatroomExists(chatroomUuid);

			if (isCurrentChatroom) {
				resetUnreadCount(chatroomUuid);
				readMessage({ chatroomUuid, timestamp });
			}
		},
	);
};
