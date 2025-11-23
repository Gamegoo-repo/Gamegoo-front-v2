import { useMutation } from "@tanstack/react-query";
import { socketManager } from "@/shared/api/socket";
import { useGamegooSocket } from "@/shared/providers/gamegoo-socket-provider";
import type { SendMessageParams } from "../lib/types";

export const useSendMessage = () => {
	const { isAuthenticated } = useGamegooSocket();

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
	});
};
