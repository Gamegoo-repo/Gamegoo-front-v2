import { publicApiClient } from "@/shared/api/config";
import type {
	ApiResponse,
	GetLolBtiRecommendationsParams,
	GetLolBtiRecommendationsResponse,
	GetLolBtiResultByResultIdResponse,
	GetParticipantsResponse,
	SaveGuestLolBtiResultRequest,
	SaveGuestLolBtiResultResponse,
	TrackRollBtiEventRequest,
} from "./types";

const BASE_PATH = "/api/v2/internal/roll-bti";

/**
 * 롤BTI 전체 참여자 수 조회
 * GET /api/v2/internal/roll-bti/participants
 */
export const getParticipants = async (): Promise<GetParticipantsResponse> => {
	const response = await publicApiClient.get<
		ApiResponse<GetParticipantsResponse>
	>(`${BASE_PATH}/participants`);
	return response.data.data;
};

/**
 * 롤BTI 공개 결과 스냅샷 생성 (회원/비회원 공통)
 * POST /api/v2/internal/roll-bti/results
 */
export const createPublicLolBtiResult = async (
	request: SaveGuestLolBtiResultRequest,
): Promise<SaveGuestLolBtiResultResponse> => {
	const response = await publicApiClient.post<
		ApiResponse<SaveGuestLolBtiResultResponse>
	>(`${BASE_PATH}/results`, request);
	return response.data.data;
};

/**
 * 비회원 롤BTI 결과 조회 (인증 불필요)
 * GET /api/v2/internal/roll-bti/results/{resultId}
 */
export const getLolBtiResultByResultId = async (
	resultId: string,
): Promise<GetLolBtiResultByResultIdResponse> => {
	const response = await publicApiClient.get<
		ApiResponse<GetLolBtiResultByResultIdResponse>
	>(`${BASE_PATH}/results/${resultId}`);
	return response.data.data;
};

/**
 * 롤BTI 이벤트 적재 (인증 불필요)
 * POST /api/v2/internal/roll-bti/events
 *
 * 분석 용도이므로 실패해도 UI에 영향 없이 조용히 처리
 */
export const trackRollBtiEvent = async (
	request: TrackRollBtiEventRequest,
): Promise<void> => {
	await publicApiClient
		.post<ApiResponse<null>>(`${BASE_PATH}/events`, request)
		.catch((err) => {
			console.error("Analytics Error:", err);
		});
};

/**
 * 롤BTI 유형 추천 게시글 목록 조회 (인증 불필요)
 * GET /api/v2/internal/roll-bti/recommendations/cursor
 *
 * @param params.type - 롤BTI 유형
 * @param params.size - 최대 50
 */
export const getLolBtiRecommendations = async (
	params: GetLolBtiRecommendationsParams,
): Promise<GetLolBtiRecommendationsResponse> => {
	const response = await publicApiClient.get<
		ApiResponse<GetLolBtiRecommendationsResponse>
	>(`${BASE_PATH}/recommendations/cursor`, {
		params: params,
	});
	return response.data.data;
};

// namespace object — api.public.lolbti.xxx 형태로 사용 가능
export const lolbtiPublicApi = {
	getParticipants,
	createPublicLolBtiResult,
	getLolBtiResultByResultId,
	trackRollBtiEvent,
	getLolBtiRecommendations,
} as const;
