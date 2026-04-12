import { formatKDA, formatKDAStats } from "@/entities/game/lib/kda";
import ChampionStatsSection from "@/entities/game/ui/champion-stats-section";
import type {
	ChampionStatsResponse,
	MemberRecentStatsResponse,
} from "@/shared/api";
import { cn } from "@/shared/lib/utils";
import React from "react";

interface RecentStatsCardProps {
	recentStats: MemberRecentStatsResponse;
	championList: ChampionStatsResponse[];
}

export default function RecentStatsCard({
	recentStats,
	championList,
}: RecentStatsCardProps) {
	const kdaStats = formatKDAStats(
		recentStats.recAvgKills,
		recentStats.recAvgDeaths,
		recentStats.recAvgAssists,
	);

	return (
		<section className="w-full">
			<h3 className="mb-2 font-semibold mobile:font-normal mobile:text-2xl text-gray-800 text-lg">
				최근 30게임
			</h3>
			<div className="flex mobile:flex-row flex-col mobile:items-center mobile:justify-between gap-3 mobile:rounded-lg rounded-xl bg-gray-100 mobile:px-8 px-5 py-4">
				{/* 승/패 */}
				<div className="flex w-fit mobile:flex-col items-center gap-2">
					<span className="font-bold mobile:text-xl text-base text-gray-700">
						{recentStats.recTotalWins}승 {recentStats.recTotalLosses}패
					</span>
					<span className="font-semibold mobile:text-sm text-gray-500 text-xs">
						{recentStats.recWinRate}%
					</span>
				</div>

				{/* KDA */}
				<div className="flex w-fit mobile:flex-col items-center gap-2">
					<p className="flex items-center gap-1">
						{kdaStats.map((text, idx) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<React.Fragment key={idx}>
								<span
									className={cn(
										"font-bold mobile:text-xl text-base text-gray-700",
										idx === 1 && "text-red-500",
									)}
								>
									{text}
								</span>
								{idx < Number(kdaStats.length) - 1 && (
									<span className="mobile:text-xl text-base text-gray-400">
										/
									</span>
								)}
							</React.Fragment>
						))}
					</p>
					<span className="font-semibold mobile:text-sm text-gray-500 text-xs">
						KDA {formatKDA(recentStats.recAvgKDA)}
					</span>
				</div>

				{/* CS */}
				<div className="flex mobile:flex-col items-center gap-2">
					<span className="font-bold mobile:text-xl text-base text-gray-700">
						평균 CS {(recentStats.recAvgCsPerMinute || 0).toFixed(1)}
					</span>
					<span className="font-semibold mobile:text-sm text-gray-500 text-xs">
						CS {recentStats.recTotalCs || 0}
					</span>
				</div>

				{/* 챔피언 */}
				<div className="flex flex-col gap-1 mobile:gap-2">
					<span className="font-medium mobile:text-sm text-[11px] text-gray-800">
						최근 선호 챔피언
					</span>
					<ChampionStatsSection championList={championList} variant="profile" />
				</div>
			</div>
		</section>
	);
}
