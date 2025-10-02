import { useSocketMessage } from "@/shared/api/socket";
import { useGamegooSocket } from "@/shared/providers/gamegoo-socket-provider";
import { useChatStore } from "../store";

interface FriendOnlineEventData {
	data: {
		memberId: number;
	};
}

interface FriendOfflineEventData {
	data: {
		memberId: number;
	};
}

interface FriendListEventData {
	data: {
		onlineFriendIds: number[];
	};
}

export const useFriendOnline = () => {
	const { isAuthenticated } = useGamegooSocket();
	const { setFriendOnline, setFriendOffline } = useChatStore();

	useSocketMessage<FriendOnlineEventData>("friend-online", (eventData) => {
		if (!isAuthenticated) return;

		const { memberId } = eventData.data;
		setFriendOnline(memberId);
	});

	useSocketMessage<FriendOfflineEventData>("friend-offline", (eventData) => {
		if (!isAuthenticated) return;

		const { memberId } = eventData.data;
		setFriendOffline(memberId);
	});

	useSocketMessage<FriendListEventData>("friend-list", (eventData) => {
		if (!isAuthenticated) return;

		const { onlineFriendIds } = eventData.data;
		setFriendOnline(onlineFriendIds);
	});
};
