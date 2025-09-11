import { AuthControllerApi } from "./@generated/api/auth-controller-api";
import { BoardApi } from "./@generated/api/board-api";
import { ChatApi } from "./@generated/api/chat-api";
import { FriendApi } from "./@generated/api/friend-api";
import { MemberApi } from "./@generated/api/member-api";
import { NotificationApi } from "./@generated/api/notification-api";
import { apiClient, apiConfiguration, tokenManager } from "./config";

export const api = {
	auth: new AuthControllerApi(apiConfiguration, undefined, apiClient),
	board: new BoardApi(apiConfiguration, undefined, apiClient),
	member: new MemberApi(apiConfiguration, undefined, apiClient),
	friend: new FriendApi(apiConfiguration, undefined, apiClient),
	chat: new ChatApi(apiConfiguration, undefined, apiClient),
	notification: new NotificationApi(apiConfiguration, undefined, apiClient),
} as const;

// 토큰 유틸리티 export
export { tokenManager };

// 타입들 export
export * from "./@generated/models";
