import type { ChampionStatsResponse } from "@/shared/api";
import { cn } from "@/shared/lib/utils";
import Tooltip from "@/shared/ui/tooltip/tooltip";
import { getWinRateString } from "../lib/get-win-rate-string";
import { getWinRateColors } from "../lib/getWinRateColor";
import { formatKDA, formatKDAStats } from "../lib/kda";

interface ChampionInfoProps extends ChampionStatsResponse {
	imageClassName?: string;
	badgeClassName?: string;
	className?: string;
}

export default function ChampionInfo({
	badgeClassName,
	imageClassName,
	...champion
}: ChampionInfoProps) {
	const isMaxWinRate = champion.winRate === 100;
	const { championName, games, wins, kda, kills, deaths, assists } = champion;
	const championInfo = (
		<div className="flex flex-col gap-3">
			<span className="font-bold mobile:font-semibold mobile:text-lg text-sm">
				{championName}
			</span>
			<div className="grid grid-cols-[auto_1fr_auto] gap-x-4 gap-y-1 mobile:gap-y-1.5">
				<StatItem
					label="승률"
					value={`${champion.winRate.toFixed(0)}%`}
					subText={getWinRateString(games, wins)}
				/>

				<StatItem
					label="KDA"
					value={formatKDA(kda)}
					subText={`${formatKDAStats(kills, deaths, assists).join(" / ")}`}
				/>

				<StatItem
					label="CS"
					value={champion.csPerMinute.toFixed(1)}
					subText={`${champion.averageCs.toFixed(1)}`}
				/>
			</div>
		</div>
	);
	return (
		<Tooltip content={championInfo}>
			<div className="flex flex-col items-center justify-center">
				<img
					src={`/champion/${champion.championId}.png`}
					alt={champion.championName}
					className={cn("h-8 w-8 shrink-0 rounded-full", imageClassName)}
				/>
				<span
					className={cn(
						"-mt-1 rounded-full px-1 text-center font-bold text-[11px] text-white leading-none",
						getWinRateColors(champion.winRate).bg,
						badgeClassName,
						isMaxWinRate && "px-0",
					)}
				>
					{Math.round(champion.winRate)}%
				</span>
			</div>
		</Tooltip>
	);
}

interface StatItemProps {
	label: string;
	value: string | number;
	subText?: string;
}

function StatItem({ label, value, subText }: StatItemProps) {
	return (
		<>
			<dt className="whitespace-nowrap font-bold mobile:text-sm text-[13px] text-gray-500">
				{label}
			</dt>
			<dd className="whitespace-nowrap font-bold mobile:text-sm text-[13px] text-gray-100">
				{value}
			</dd>
			<dd className="bold whitespace-nowrap mobile:text-sm text-[13px] text-gray-100">
				{subText || ""}
			</dd>
		</>
	);
}
