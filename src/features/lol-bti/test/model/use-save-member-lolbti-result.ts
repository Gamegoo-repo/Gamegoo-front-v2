import { useMutation } from "@tanstack/react-query";
import type {
	SaveGuestLolBtiResultRequest,
	SaveLolBtiResultResponse,
} from "../api";
import { createPublicLolBtiResult, saveLolBtiResult } from "../api";
import type { LolBtiResultType } from "../config";

export interface SaveMemberLolBtiResultRequest
	extends SaveGuestLolBtiResultRequest {
	type: LolBtiResultType;
}

export interface SaveMemberLolBtiResultResponse {
	/** 회원 API 저장 결과 */
	memberResult: SaveLolBtiResultResponse;
	/** 공유 링크용 resultId. 공개 스냅샷 생성 실패 시 null */
	resultId: string | null;
}

/**
 * 회원 롤BTI 결과 저장 mutation 훅
 *
 * 두 가지 역할을 병렬로 처리한다:
 * 1. 회원 프로필에 BTI 타입 저장 (POST /api/v2/roll-bti/me)
 * 2. 공유 가능한 공개 스냅샷 생성 (POST /api/v2/internal/roll-bti/results)
 *
 * 공개 스냅샷 생성 실패 시 resultId가 null이 되지만 결과 화면은 정상 표시된다.
 * 회원 프로필 저장 실패 시 onError가 호출된다.
 */

const saveMemberLolBtiResult = async (
	request: SaveMemberLolBtiResultRequest,
) => {
	const [memberSettled, publicSettled] = await Promise.allSettled([
		saveLolBtiResult({ type: request.type }),
		createPublicLolBtiResult({
			type: request.type,
			resultPayload: request.resultPayload,
			sessionId: request.sessionId,
		}),
	]);

	// 회원 저장에 실패한 경우
	if (memberSettled.status === "rejected") throw memberSettled.reason;

	return {
		memberResult: memberSettled.value,
		resultId:
			publicSettled.status === "fulfilled"
				? publicSettled.value.resultId
				: null,
	};
};

export const useSaveMemberLolBtiResult = () => {
	return useMutation({
		mutationFn: saveMemberLolBtiResult,
	});
};
