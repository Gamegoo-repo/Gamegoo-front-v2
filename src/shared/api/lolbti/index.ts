// named function export (기존 features 레이어 하위 호환)
export {
	getParticipants,
	createPublicLolBtiResult,
	getLolBtiResultByResultId,
	trackRollBtiEvent,
	getLolBtiRecommendations,
	lolbtiPublicApi,
} from "./lolbti-public-api";

export {
	saveLolBtiResult,
	getMyLolBtiResult,
	lolbtiPrivateApi,
} from "./lolbti-private-api";

export type {
	ApiResponse,
	RollBtiEventType,
	RollBtiEventSource,
	TrackRollBtiEventRequest,
	GetParticipantsResponse,
	SaveGuestLolBtiResultRequest,
	SaveGuestLolBtiResultResponse,
	GetLolBtiResultByResultIdResponse,
	AxisPercentages,
	SaveLolBtiResultRequest,
	SaveLolBtiResultResponse,
	GetMyLolBtiResultResponse,
	LolBtiRecommendation,
	GetLolBtiRecommendationsParams,
	GetLolBtiRecommendationsResponse,
} from "./types";
