import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";

export const useEnterChatroom = (chatroomUuid: string | null) => {
	return useQuery({
		queryKey: ["enter-chatroom", chatroomUuid],
		queryFn: async () => {
			if (!chatroomUuid) {
				throw new Error("Chatroom UUID is required");
			}
			const response = await api.chat.enterChatroom(chatroomUuid);
			return response.data;
		},
		enabled: !!chatroomUuid,
		staleTime: 0,
		retry: false,
	});
};
