import { BlockApi, HomeApi, MannerApi, ReportApi, RiotApi } from "./@generated";
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
import { lolbtiPrivateApi, lolbtiPublicApi } from "./lolbti";

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
		block: new BlockApi(privateApiConfiguration, undefined, privateApiClient),
		report: new ReportApi(privateApiConfiguration, undefined, privateApiClient),
		manner: new MannerApi(privateApiConfiguration, undefined, privateApiClient),
		// OpenAPI 자동 생성 실패로 직접 구현한 롤BTI 회원 API
		lolbti: lolbtiPrivateApi,
	},
	public: {
		home: new HomeApi(publicApiConfiguration, undefined, publicApiClient),
		board: new BoardApi(publicApiConfiguration, undefined, publicApiClient),
		riot: new RiotApi(publicApiConfiguration, undefined, publicApiClient),
		// OpenAPI 자동 생성 실패로 직접 구현한 롤BTI 공개 API
		lolbti: lolbtiPublicApi,
	},
} as const;

// 토큰 유틸리티 export
export { tokenManager };

// OpenAPI 자동 생성 타입 export
export * from "./@generated/models";

// 롤BTI 수동 정의 타입 export
export * from "./lolbti";
