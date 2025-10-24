export interface SystemData {
	flag?: number;
	boardId?: number;
}

export interface SendMessageParams {
	uuid: string;
	message: string;
	system?: SystemData;
}

export interface ChatMessageEventData {
	data: {
		senderId: number;
		senderName: string | null;
		senderProfileImg: number | null;
		message: string;
		createdAt: string;
		timestamp: number;
		chatroomUuid: string;
	};
}

export interface SystemMessageEventData {
	data: {
		senderId: number;
		senderName: string | null;
		senderProfileImg: number | null;
		message: string;
		createdAt: string;
		timestamp: number;
		chatroomUuid: string;
		systemType?: number;
		boardId?: number | null;
	};
}
