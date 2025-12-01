import { useChatStore } from "@/entities/chat";
import { useSocketMessage } from "@/shared/api/socket";

export const useChatNotifications = () => {
	const { updateChatroom, totalUnreadCount, incrementUnreadCount } =
		useChatStore();

	// 채팅방 업데이트
	useSocketMessage(
		"chatroom_update",
		(chatroomData: {
			chatroomId: number;
			uuid: string;
			targetMemberId: number;
			targetMemberImg: number;
			targetMemberName: string;
			friend: boolean;
			blocked: boolean;
			blind: boolean;
			friendRequestMemberId: number;
			lastMsg: string;
			lastMsgAt: string;
			notReadMsgCnt: number;
			lastMsgTimestamp: number;
		}) => {
			updateChatroom(chatroomData);
		},
	);

	useSocketMessage(
		"unread_count_update",
		({ chatroomUuid, count }: { chatroomUuid: string; count: number }) => {
			if (count > 0) {
				incrementUnreadCount(chatroomUuid);
			}
		},
	);

	return {
		totalUnreadCount,
	};
};
