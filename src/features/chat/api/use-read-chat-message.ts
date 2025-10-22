import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api";

interface ReadChatMessageParams {
	chatroomUuid: string;
	timestamp?: number;
}

export const useReadChatMessage = () => {
	return useMutation({
		mutationFn: async ({ chatroomUuid, timestamp }: ReadChatMessageParams) => {
			const response = await api.chat.readChatMessage(chatroomUuid, timestamp);
			return response.data;
		},
	});
};
