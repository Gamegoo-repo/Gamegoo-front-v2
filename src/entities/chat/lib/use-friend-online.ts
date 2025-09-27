import { useCallback } from "react";
import { useSocketMessage } from "@/shared/api/socket";
import { useChatStore } from "../store";

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

export const useFriendOnline = () => {
	const { setFriendOnline, setFriendOffline } = useChatStore();

	// 초기 온라인 친구 목록 처리
	const handleInitOnlineFriend = useCallback(
		(res: InitOnlineFriendResponse) => {
			const onlineFriendsList = res.data.onlineFriendMemberIdList;
			setFriendOnline(onlineFriendsList);
		},
		[setFriendOnline],
	);

	// 친구 온라인 이벤트 처리
	const handleOnlineFriend = useCallback(
		(res: FriendOnlineResponse) => {
			const onlineFriendId = res.data.memberId;
			setFriendOnline(onlineFriendId);
		},
		[setFriendOnline],
	);

	// 친구 오프라인 이벤트 처리
	const handleOfflineFriend = useCallback(
		(res: FriendOnlineResponse) => {
			const offlineFriendId = res.data.memberId;
			setFriendOffline(offlineFriendId);
		},
		[setFriendOffline],
	);

	// 소켓 이벤트 등록
	useSocketMessage("init-online-friend-list", handleInitOnlineFriend);
	useSocketMessage("friend-online", handleOnlineFriend);
	useSocketMessage("friend-offline", handleOfflineFriend);
};
