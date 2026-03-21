import { privateApiClient } from "@/shared/api/config";
import type {
	ApiResponse,
	GetLolBtiRecommendationsParams,
	GetMyLolBtiRecommendationsResponse,
	GetMyLolBtiResultResponse,
	SaveLolBtiResultRequest,
	SaveLolBtiResultResponse,
} from "./types";

const BASE_PATH = "/api/v2/roll-bti/me";

/**
 * 퀴즈 완료 후 결과 저장 (로그인 필수)
 * POST /api/v2/roll-bti/me
 */
export const saveLolBtiResult = async (
	request: SaveLolBtiResultRequest,
): Promise<SaveLolBtiResultResponse> => {
	const response = await privateApiClient.post<
		ApiResponse<SaveLolBtiResultResponse>
	>(BASE_PATH, request);
	return response.data.data;
};

/**
 * 내 저장된 롤BTI 결과 조회 (로그인 필수)
 * GET /api/v2/roll-bti/me
 */
export const getMyLolBtiResult =
	async (): Promise<GetMyLolBtiResultResponse> => {
		const response =
			await privateApiClient.get<ApiResponse<GetMyLolBtiResultResponse>>(
				BASE_PATH,
			);
		return response.data.data;
	};

/**
 * 롤BTI 유형 기반 추천 게시글 목록 조회 (로그인 사용자)
 * GET /api/v2/roll-bti/me/recommendations/cursor
 *
 * public API와 동일한 파라미터 구조를 사용하되
 * privateApiClient로 호출하여 JWT 기반 개인화 추천을 받는다.
 */
export const getLolBtiRecommendations = async (
	params: GetLolBtiRecommendationsParams,
): Promise<GetMyLolBtiRecommendationsResponse> => {
	const response = await privateApiClient.get<
		ApiResponse<GetMyLolBtiRecommendationsResponse>
	>(`${BASE_PATH}/recommendations/cursor`, {
		params: params,
	});
	return response.data.data;
};

// namespace object — api.private.lolbti.xxx 형태로 사용 가능
export const lolbtiPrivateApi = {
	saveLolBtiResult,
	getMyLolBtiResult,
	getLolBtiRecommendations,
} as const;
