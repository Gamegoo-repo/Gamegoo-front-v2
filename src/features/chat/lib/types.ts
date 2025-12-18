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

// /**
//  * JWT 만료 에러 데이터
//  * @template TEventData - 원래 전송하려던 이벤트 데이터의 타입
//  */
// export interface JwtExpiredErrorData<TEventData = unknown> {
// 	event: "jwt-expired-error";
// 	data: {
// 		/** 실행하려던 원본 이벤트 이름*/
// 		eventName: string;
// 		/** 실행하려던 원본 이벤트 데이터 */
// 		eventData: TEventData;
// 	};
// 	timestamp: string;
// }
