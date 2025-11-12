import { BlockApi, MannerApi, ReportApi, RiotApi } from "./@generated";
import { AuthControllerApi } from "./@generated/api/auth-controller-api";
import { BoardApi } from "./@generated/api/board-api";
import { ChatApi } from "./@generated/api/chat-api";
import { FriendApi } from "./@generated/api/friend-api";
import { MemberApi } from "./@generated/api/member-api";
import { NotificationApi } from "./@generated/api/notification-api";
import {
	privateApiClient,
	privateApiConfiguration,
	publicApiClient,
	publicApiConfiguration,
	tokenManager,
} from "./config";

export const api = {
	private: {
		auth: new AuthControllerApi(
			privateApiConfiguration,
			undefined,
			privateApiClient,
		),
		board: new BoardApi(privateApiConfiguration, undefined, privateApiClient),
		member: new MemberApi(privateApiConfiguration, undefined, privateApiClient),
		friend: new FriendApi(privateApiConfiguration, undefined, privateApiClient),
		chat: new ChatApi(privateApiConfiguration, undefined, privateApiClient),
		notification: new NotificationApi(
			privateApiConfiguration,
			undefined,
			privateApiClient,
		),
		block: new BlockApi(publicApiConfiguration, undefined, publicApiClient),
		report: new ReportApi(publicApiConfiguration, undefined, publicApiClient),
		manner: new MannerApi(privateApiConfiguration, undefined, privateApiClient),
	},
	public: {
		board: new BoardApi(publicApiConfiguration, undefined, publicApiClient),
		riot: new RiotApi(publicApiConfiguration, undefined, publicApiClient),
	},
} as const;

// 토큰 유틸리티 export
export { tokenManager };

// 타입들 export
export * from "./@generated/models";
