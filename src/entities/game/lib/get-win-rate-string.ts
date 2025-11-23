export const getWinRateString = (games: number, wins: number) => {
	/** games가 전체 게임수가 맞는지 확인할 필요가 있음 */
	return `${wins}승 ${games - wins}패`;
};
