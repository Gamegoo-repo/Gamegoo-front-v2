import { useInfiniteQuery } from "@tanstack/react-query";
import { api, type ChatMessageListResponse } from "@/shared/api";
import type { ChatMessageResponse } from "@/shared/api/@generated/models/chat-message-response";

export const useChatMessagesQuery = (chatroomUuid: string | null) => {
	return useInfiniteQuery({
		queryKey: ["chatMessages", chatroomUuid],
		queryFn: async ({ pageParam = undefined }) => {
			if (!chatroomUuid) {
				throw new Error("Chatroom UUID is required");
			}

			const response = await api.chat.getChatMessages(chatroomUuid, pageParam);
			return (
				response.data.data || {
					chatMessageList: [],
					hasNext: false,
					nextCursor: undefined,
					listSize: 0,
				}
			);
		},
		getNextPageParam: (lastPage: ChatMessageListResponse) => {
			return lastPage.hasNext ? lastPage.nextCursor : undefined;
		},
		enabled: !!chatroomUuid,
		initialPageParam: undefined,
	});
};

export const useChatMessages = (chatroomUuid: string | null) => {
	const queryResult = useChatMessagesQuery(chatroomUuid);
	const {
		data,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = queryResult;

	// 모든 페이지의 메시지를 하나의 배열로 합치기 (최신 메시지가 마지막에 오도록)
	const messages: ChatMessageResponse[] =
		data?.pages.flatMap((page) => page.chatMessageList || []).reverse() || [];

	return {
		messages,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		totalCount: data?.pages[0]?.listSize || 0,
	};
};
