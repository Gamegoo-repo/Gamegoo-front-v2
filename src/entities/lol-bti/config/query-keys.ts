export const lolbtiKeys = {
	all: ["lolbti"] as const,
	me: () => [...lolbtiKeys.all, "me"] as const,
	participants: () => [...lolbtiKeys.all, "participants"] as const,
	boards: () => [...lolbtiKeys.all, "boards"] as const,
	/**
	 * 로그인 + 롤BTI 보유 유저용 추천 목록.
	 */
	privateBoards: () => [...lolbtiKeys.boards(), "private"] as const,
	/**
	 *
	 * 로그인 x 또는 롤BTIx
	 */
	publicBoards: () => [...lolbtiKeys.boards(), "public"] as const,
} as const;
