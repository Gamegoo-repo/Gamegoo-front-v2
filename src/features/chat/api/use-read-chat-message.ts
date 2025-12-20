import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "@/entities/chat/config/query-keys";
import { api } from "@/shared/api";

interface ReadChatMessageParams {
	chatroomUuid: string;
	timestamp?: number;
}

export const useReadChatMessage = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ chatroomUuid, timestamp }: ReadChatMessageParams) => {
			const response = await api.private.chat.readChatMessage(
				chatroomUuid,
				timestamp,
			);
			return response.data;
		},
		onSuccess: (_data, variables) => {
			const uuid = variables.chatroomUuid;
			void queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
			void queryClient.invalidateQueries({ queryKey: chatKeys.enter(uuid) });
		},
	});
};
