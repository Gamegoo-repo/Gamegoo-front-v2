export interface ChatMessage {
	senderId: number;
	senderName: string | null;
	senderProfileImg: number | null;
	message: string;
	createdAt: string;
	timestamp: number;
	systemType?: number;
	boardId?: number | null;
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

export interface ChatState {
	chatrooms: Chatroom[];
	totalUnreadCount: number;
	isConnected: boolean;
	onlineFriends: number[];
}
