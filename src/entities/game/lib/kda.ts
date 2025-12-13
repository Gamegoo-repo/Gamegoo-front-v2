export function formatKDAStats(kills: number, deaths: number, assists: number) {
	return [kills.toFixed(1), deaths.toFixed(1), assists.toFixed(1)];
}

export function formatKDA(kda: number) {
	return kda.toFixed(1);
}
