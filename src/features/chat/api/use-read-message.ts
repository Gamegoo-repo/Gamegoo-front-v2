import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api";

export const useReadMessage = () => {
	return useMutation({
		mutationFn: async ({
			chatroomUuid,
			timestamp,
		}: {
			chatroomUuid: string;
			timestamp?: number;
		}) => {
			const response = await api.chat.readChatMessage(chatroomUuid, timestamp);
			return response.data;
		},
		onSuccess: () => {},
	});
};
