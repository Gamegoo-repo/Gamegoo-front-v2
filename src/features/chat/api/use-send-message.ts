import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "@/entities/chat";
import { chatKeys } from "@/entities/chat/config/query-keys";
import { useChatDialogStore } from "@/entities/chat/store/use-chat-dialog-store";
import { socketManager } from "@/shared/api/socket";
import { useGamegooSocket } from "@/shared/providers/gamegoo-socket-provider";
import type { SendMessageParams } from "../lib/types";

export const useSendMessage = () => {
	const { isAuthenticated } = useGamegooSocket();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ uuid, message, system }: SendMessageParams) => {
			if (!isAuthenticated) {
				throw new Error("Not authenticated");
			}

			if (!socketManager.connected) {
				throw new Error("소켓이 연결되지 않았습니다.");
			}

			const emitData = {
				uuid,
				message,
				...(system && { system }),
			};

			socketManager.send("chat-message", emitData);

			return { success: true };
		},
		onSuccess: (_data, variables) => {
			const { uuid, message } = variables;
			const { updateChatroom } = useChatStore.getState();
			const { chatroom } = useChatDialogStore.getState();

			if (chatroom && chatroom.uuid === uuid) {
				const nowIso = new Date().toISOString();
				updateChatroom({
					...chatroom,
					lastMsg: message,
					lastMsgAt: nowIso,
					lastMsgTimestamp: Date.now(),
					notReadMsgCnt: 0,
				});
			}

			// Also request a server refresh in the background to align ordering/unread
			void queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
		},
	});
};
