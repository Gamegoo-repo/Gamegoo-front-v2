import { useCallback } from "react";
import { useChatStore } from "@/entities/chat";
import { useSocketMessage } from "@/shared/api/socket";
import { useGamegooSocket } from "@/shared/providers/gamegoo-socket-provider";

interface FriendOnlineResponse {
	data: {
		memberId: number;
	};
}

interface InitOnlineFriendResponse {
	data: {
		onlineFriendMemberIdList: number[];
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

	// 초기 온라인 친구 목록 처리
	const handleInitOnlineFriend = useCallback(
		(res: InitOnlineFriendResponse) => {
			if (!isAuthenticated) return;
			const onlineFriendsList = res.data.onlineFriendMemberIdList;
			setFriendOnline(onlineFriendsList);
		},
		[setFriendOnline, isAuthenticated],
	);

	// 친구 온라인 이벤트 처리
	const handleOnlineFriend = useCallback(
		(res: FriendOnlineResponse) => {
			if (!isAuthenticated) return;
			const onlineFriendId = res.data.memberId;
			setFriendOnline(onlineFriendId);
		},
		[setFriendOnline, isAuthenticated],
	);

	// 친구 오프라인 이벤트 처리
	const handleOfflineFriend = useCallback(
		(res: FriendOnlineResponse) => {
			if (!isAuthenticated) return;
			const offlineFriendId = res.data.memberId;
			setFriendOffline(offlineFriendId);
		},
		[setFriendOffline, isAuthenticated],
	);

	// friend-list 이벤트 처리 (entities/chat 버전의 기능 추가)
	const handleFriendList = useCallback(
		(res: FriendListEventData) => {
			if (!isAuthenticated) return;
			const { onlineFriendIds } = res.data;
			setFriendOnline(onlineFriendIds);
		},
		[setFriendOnline, isAuthenticated],
	);

	// 소켓 이벤트 등록
	useSocketMessage("init-online-friend-list", handleInitOnlineFriend);
	useSocketMessage("friend-online", handleOnlineFriend);
	useSocketMessage("friend-offline", handleOfflineFriend);
	useSocketMessage("friend-list", handleFriendList);
};
