import { useChatStore } from "@/entities/chat";
import { useSocketMessage } from "@/shared/socket";

export const useChatNotifications = () => {
	const { addMessage, updateChatroom, totalUnreadCount, incrementUnreadCount } =
		useChatStore();

	// 채팅 메시지
	useSocketMessage(
		"chat_message",
		(messageData: {
			chatroomUuid: string;
			senderId: number;
			senderName: string | null;
			senderProfileImg: number | null;
			message: string;
			createdAt: string;
			timestamp: number;
			systemType?: number;
			boardId?: number | null;
		}) => {
			addMessage(
				{
					senderId: messageData.senderId,
					senderName: messageData.senderName,
					senderProfileImg: messageData.senderProfileImg,
					message: messageData.message,
					createdAt: messageData.createdAt,
					timestamp: messageData.timestamp,
					systemType: messageData.systemType,
					boardId: messageData.boardId,
				},
				messageData.chatroomUuid,
			);
		},
	);

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

	// 읽지 않은 메시지
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
