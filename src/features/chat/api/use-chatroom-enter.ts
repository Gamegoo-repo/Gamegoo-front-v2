import { useQuery } from "@tanstack/react-query";
import { chatKeys } from "@/entities/chat/config/query-keys";
import { api } from "@/shared/api";

export const useEnterChatroom = (
	chatroomUuid: string | null,
	options?: { enabled?: boolean },
) => {
	return useQuery({
		queryKey: chatKeys.enter(chatroomUuid || ""),
		queryFn: async () => {
			const response = await api.private.chat.enterChatroom(chatroomUuid || "");
			return response.data;
		},
		enabled: !!chatroomUuid && (options?.enabled ?? true),
		staleTime: 0,
		retry: false,
	});
};
