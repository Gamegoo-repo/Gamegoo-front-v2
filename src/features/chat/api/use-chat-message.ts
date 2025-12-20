import { useInfiniteQuery } from "@tanstack/react-query";
import type { ChatMessage } from "@/entities/chat";
import { chatKeys } from "@/entities/chat/config/query-keys";
import { api, type ChatMessageListResponse } from "@/shared/api";

export const useChatMessageFetcher = (chatroomUuid: string | null) => {
	return useInfiniteQuery({
		queryKey: chatKeys.messages(chatroomUuid || ""),
		queryFn: async ({ pageParam = undefined }) => {
			const response = await api.private.chat.getChatMessages(
				chatroomUuid || "",
				pageParam,
			);
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
		staleTime: 0,
		refetchOnMount: true,
	});
};

export const useChatMessage = (chatroomUuid: string | null) => {
	const queryResult = useChatMessageFetcher(chatroomUuid);
	const {
		data,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = queryResult;

	const messages: ChatMessage[] =
		data?.pages
			.flatMap((page) => page.chatMessageList || [])
			.map(
				(msg): ChatMessage => ({
					...msg,
					senderName: msg.senderName || undefined,
					senderProfileImg: msg.senderProfileImg || undefined,
				}),
			) || [];

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
