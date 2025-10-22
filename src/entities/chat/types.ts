import type { ChatroomResponse } from "@/shared/api";
import type { ChatMessageResponse } from "@/shared/api/@generated/models/chat-message-response";

export interface ChatMessage extends ChatMessageResponse {
	systemType?: number;
	boardId?: number | null;
	chatroomUuid?: string; // socket 이벤트에서 사용
}

export interface Chatroom {
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
}

export interface ChatroomMessages {
	[uuid: string]: ChatMessage[];
}

export interface ChatState {
	chatrooms: ChatroomResponse[];
	totalUnreadCount: number;
	isConnected: boolean;
	onlineFriends: number[];
}
