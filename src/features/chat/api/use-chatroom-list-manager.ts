import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useChatStore } from "@/entities/chat";
import { chatKeys } from "@/entities/chat/config/query-keys";
import { api } from "@/shared/api";
import { tokenManager } from "@/shared/api/config";
import { useSocketMessage } from "@/shared/api/socket";

export const useChatroomListManager = () => {
	const { setChatrooms, setConnected } = useChatStore();
	const accessToken = tokenManager.getAccessToken();
	const isAuthenticated = !!accessToken;

	const {
		data: chatroomsData,
		error,
		isFetching,
		refetch,
	} = useQuery({
		queryKey: chatKeys.rooms(),
		queryFn: async () => {
			const response = await api.private.chat.getChatroom();
			return response.data;
		},
		placeholderData: keepPreviousData,
		enabled: isAuthenticated,
	});

	useEffect(() => {
		if (chatroomsData?.data?.chatroomResponseList) {
			setChatrooms(chatroomsData.data.chatroomResponseList);
		}
	}, [chatroomsData, setChatrooms]);

	useSocketMessage("joined-new-chatroom", async () => {
		await refetch();
	});

	useSocketMessage("connect", () => {
		setConnected(true);
	});

	useSocketMessage("disconnect", () => {
		setConnected(false);
	});

	return {
		isFetching,
		error,
		refetch,
	};
};
