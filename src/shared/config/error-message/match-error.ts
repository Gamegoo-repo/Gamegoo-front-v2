export const MATCH_ERROR_MESSAGES = {
	MATCH_401: "해당 매칭이 존재하지 않습니다",
	MATCH_402: "해당 회원과 매칭된 회원이 없습니다",
	MATCH_403: "현재 매칭 상태에서는 요청할 수 없습니다",
	MATCH_404: "상대방이 다른 매칭 로직을 진행 중입니다",
	MATCH_405:
		"매칭 상대 회원을 차단한 상태입니다. 매칭 FOUND 처리가 불가능합니다",
	MATCH_406:
		"매칭 상대 회원이 나를 차단했습니다. 매칭 FOUND 처리가 불가능합니다",
	MATCH_407: "sender와 receiver의 matchingUuid가 동일합니다",
} as const;
