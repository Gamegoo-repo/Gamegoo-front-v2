import type {
	MannerKeywordListResponse,
	MannerResponse,
	OtherProfileResponse,
} from "@/shared/api";

/**
 * 매너 평가 키워드 Mock 데이터
 * 긍정 평가 6개, 부정 평가 6개로 구성
 */
export const MOCK_MANNER_KEYWORDS: MannerKeywordListResponse = {
	mannerKeywords: [
		// 긍정 평가 (0-5)
		{ mannerKeywordId: 1, count: 8 },
		{ mannerKeywordId: 2, count: 5 },
		{ mannerKeywordId: 3, count: 2 },
		{ mannerKeywordId: 4, count: 5 },
		{ mannerKeywordId: 5, count: 0 },
		{ mannerKeywordId: 6, count: 5 },
		// 부정 평가 (6-11)
		{ mannerKeywordId: 7, count: 1 },
		{ mannerKeywordId: 8, count: 0 },
		{ mannerKeywordId: 9, count: 0 },
		{ mannerKeywordId: 10, count: 0 },
		{ mannerKeywordId: 11, count: 0 },
		{ mannerKeywordId: 12, count: 0 },
	],
} as const;

/**
 * 매너 레벨 Mock 데이터
 */
export const MOCK_MANNER_LEVEL: MannerResponse = {
	mannerLevel: 4,
	mannerRank: 15,
	mannerRatingCount: 4,
} as const;

/**
 * 다른 사용자 프로필 Mock 데이터
 */
export const MOCK_USER_PROFILE: OtherProfileResponse = {
	id: 12345,
	profileImg: 3,
	mike: "AVAILABLE",
	gameName: "GAMEGOO",
	tag: "KR1",
	soloTier: "SILVER",
	soloRank: 4,
	soloWinrate: 57.3,
	freeTier: "UNRANKED",
	freeRank: 2,
	freeWinrate: 52.1,
	updatedAt: new Date().toISOString(),
	mainP: "ADC",
	subP: "SUP",
	wantP: ["MID", "SUP"],
	isAgree: true,
	isBlind: false,
	loginType: "RSO",
	blocked: false,
	friend: false,
	friendRequestMemberId: undefined,
	gameStyleResponseList: [
		{ gameStyleId: 1, gameStyleName: "이기기만 하면 뭔들" },
		{ gameStyleId: 2, gameStyleName: "과도한 핑은 사절이에요" },
		{ gameStyleId: 3, gameStyleName: "랭크 올리고 싶어요" },
	],
	championStatsResponseList: [
		{
			championId: 22,
			championName: "애쉬",
			winRate: 62,
			wins: 8,
			games: 13,
			csPerMinute: 6.5,
			averageCs: 169,
			kda: 2.88,
			kills: 3.7,
			deaths: 3.3,
			assists: 5.8,
		},
		{
			championId: 81,
			championName: "이즈리얼",
			winRate: 52,
			wins: 7,
			games: 12,
			csPerMinute: 6.5,
			averageCs: 260,
			kda: 2.8,
			kills: 7.2,
			deaths: 2.6,
			assists: 10.1,
		},
		{
			championId: 119,
			championName: "드레이븐",
			winRate: 49,
			wins: 11,
			games: 20,
			csPerMinute: 7.1,
			averageCs: 284,
			kda: 3.1,
			kills: 9.0,
			deaths: 2.9,
			assists: 9.5,
		},
		{
			championId: 145,
			championName: "카이사",
			winRate: 49,
			wins: 11,
			games: 20,
			csPerMinute: 7.1,
			averageCs: 284,
			kda: 3.1,
			kills: 9.0,
			deaths: 2.9,
			assists: 9.5,
		},
	],
	memberRecentStats: {
		recTotalWins: 14,
		recTotalLosses: 16,
		recWinRate: 46.7,
		recAvgKDA: 2.33,
		recAvgKills: 6.0,
		recAvgDeaths: 5.4,
		recAvgAssists: 6.5,
		recAvgCsPerMinute: 7.6,
		recTotalCs: 226,
	},
	canRefresh: true,
} as const;
