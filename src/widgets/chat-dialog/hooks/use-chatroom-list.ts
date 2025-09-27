import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useChatStore } from "@/entities/chat";
import { api } from "@/shared/api";
import { useSocketMessage } from "@/shared/api/socket";

const useChatroomList = () => {
	const { setChatrooms, setConnected } = useChatStore();

	const {
		data: chatroomsData,
		error,
		isFetching,
		refetch,
	} = useQuery({
		queryKey: ["chatrooms"],
		queryFn: async () => {
			const response = await api.chat.getChatroom();
			return response.data;
		},
		placeholderData: keepPreviousData,
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

export default useChatroomList;
