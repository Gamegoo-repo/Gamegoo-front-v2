import { useMutation } from "@tanstack/react-query";
import { useSocketSend } from "@/shared/api/socket";
import { useGamegooSocket } from "@/shared/providers/gamegoo-socket-provider";
import type { SendMessageParams } from "../lib/types";

export const useSendMessage = () => {
	const { send, isConnected } = useSocketSend();
	const { isAuthenticated } = useGamegooSocket();

	return useMutation({
		mutationFn: async ({ uuid, message, system }: SendMessageParams) => {
			if (!isAuthenticated) {
				throw new Error("Not authenticated");
			}

			if (!isConnected) {
				throw new Error("소켓이 연결되지 않았습니다.");
			}

			const emitData = {
				uuid,
				message,
				...(system && { system }),
			};

			const success = send("chat-message", emitData);
			if (!success) {
				throw new Error("Failed to send message");
			}

			return { success: true };
		},
	});
};
