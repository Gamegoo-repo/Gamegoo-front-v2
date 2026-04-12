import type { Mike } from "@/shared/api/@generated/models/mike";
import type { Position } from "@/shared/api/@generated/models/position";
import type { Tier } from "@/shared/api/@generated/models/tier";
import type { LolBtiResultType } from "@/shared/lib/constants/lolbti-result-type";
import type { ChampionStatsResponse } from "../@generated";

// ─────────────────────────────────────────────
// 공통 응답 envelope
// ─────────────────────────────────────────────

export interface ApiResponse<T> {
	status: number;
	message: string;
	code?: string;
	data: T;
}

// ─────────────────────────────────────────────
// 이벤트 적재 — 인증 불필요 (internal API)
// ─────────────────────────────────────────────

/**
 * 롤BTI 이벤트 종류
 * - START_TEST: 테스트 시작
 * - COMPLETE_TEST: 테스트 완료
 * - RESULT_CARD_SAVE: 결과 카드 저장
 * - RESULT_CARD_SHARE: 결과 카드 공유
 * - GO_TO_GAMEGOO: 게임구로 이동
 * - SIGNUP_COMPLETE: 회원가입 완료
 */
export type RollBtiEventType =
	| "START_TEST"
	| "COMPLETE_TEST"
	| "RESULT_CARD_SAVE"
	| "RESULT_CARD_SHARE"
	| "GO_TO_GAMEGOO"
	| "SIGNUP_COMPLETE";

/** 이벤트 발생 출처 */
export type RollBtiEventSource = "WEB" | "MOBILE";

/** POST /events — 이벤트 적재 요청 바디 */
export interface TrackRollBtiEventRequest {
	eventType: RollBtiEventType;
	/** 롤BTI 유형 (결과가 확정된 시점 이후에만 전달) */
	rollBtiType?: LolBtiResultType;
	sessionId: string;
	eventSource: RollBtiEventSource;
}

// ─────────────────────────────────────────────
// Integration API — 인증 불필요, 통계성 데이터
// ─────────────────────────────────────────────

/** GET /participants */
export interface GetParticipantsResponse {
	totalParticipants: number;
}

// ─────────────────────────────────────────────
// Guest API — 비회원 결과 저장
// ─────────────────────────────────────────────

/** POST /results — 비회원 롤BTI 결과 저장 요청 바디 */
export interface SaveGuestLolBtiResultRequest {
	type: LolBtiResultType;
	resultPayload: Record<string, unknown>;
	sessionId: string;
}

/** POST /results — 비회원 롤BTI 결과 저장 응답 */
export interface SaveGuestLolBtiResultResponse {
	resultId: string;
	type: LolBtiResultType;
	createdAt: string;
}

/** GET /results/{resultId} — 비회원 결과 조회 응답 */
export interface GetLolBtiResultByResultIdResponse {
	resultId: string;
	type: LolBtiResultType;
	resultPayload: Record<string, unknown>;
	createdAt: string;
}

// ─────────────────────────────────────────────
// Member API — 인증 필요, 사용자별 데이터
// ─────────────────────────────────────────────

/**
 * 각 축의 좌측 유형(A, D, C, I)이 선택된 비율 (0~100).
 * - af: Aggressor 비율 (100이면 완전 Aggressor, 0이면 완전 Farmer)
 * - ds: Developer 비율
 * - ct: Carry 비율
 * - ib: Initiator 비율
 */
export interface AxisPercentages {
	af: number;
	ds: number;
	ct: number;
	ib: number;
}

/** POST /result — 퀴즈 완료 후 결과 저장 요청 바디 */
export interface SaveLolBtiResultRequest {
	type: LolBtiResultType;
}

/** POST /result — 퀴즈 완료 후 결과 저장 응답 */
export interface SaveLolBtiResultResponse {
	memberId: number;
	type: string;
	createdAt: string;
}

/** GET /result/me — 내 저장된 결과 조회 응답 */
export interface GetMyLolBtiResultResponse {
	type: LolBtiResultType;
	memberId: number;
	updatedAt: string;
}

// ─────────────────────────────────────────────
// Member Recommendations API — 인증 필요, 롤BTI 기반 추천
// ─────────────────────────────────────────────

/** 롤BTI 기반 추천 게시글 단일 항목 */
export interface LolBtiRecommendation {
	memberId: number;
	gameName: string;
	tag: string;
	profileImage: number;
	mannerLevel: number;
	mainP: Position;
	subP: Position;
	mike: Mike;
	rollBtiType: LolBtiResultType;
	updatedAt: string;
	championStatsResponseList: ChampionStatsResponse[];
}

export type MyLolBtiRecommendation = LolBtiRecommendation & {
	compatibilityScore: number;
	friend: boolean;
	friendRequestReceived: boolean;
	friendRequestSent: boolean;
	nonFriend: boolean;
};

/** 롤BTI 기반 추천 목록 쿼리 파라미터 */
export interface GetLolBtiRecommendationsParams {
	size?: number;
	cursorMemberId?: number;
	tier?: Tier;
}

/** GET /recommendations/cursor — 롤BTI 기반 추천 목록 응답 */
export interface GetLolBtiRecommendationsResponse {
	requestedSize: number;
	count: number;
	hasNext: boolean;
	nextCursorMemberId: number;
	recommendations: LolBtiRecommendation[];
}

export interface GetMyLolBtiRecommendationsResponse {
	requesterType: LolBtiResultType;
	requestedSize: number;
	count: number;
	hasNext: boolean;
	nextCursorMemberId: number;
	recommendations: MyLolBtiRecommendation[];
}
