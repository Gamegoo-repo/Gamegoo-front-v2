import type { ChampionStatsResponse } from "@/shared/api";
import { cn } from "@/shared/lib/utils";
import { getWinRateColors } from "../lib/getWinRateColor";
import Tooltip from "@/shared/ui/tootip/tooltip";

export default function ChampionInfo({ ...champion }: ChampionStatsResponse) {
	const championInfo = (
		<div className="flex flex-col gap-3">
			<span className="semibold-18">{champion.championName}</span>
			<StatItem
				label="승률"
				value={`${champion.winRate.toFixed(0)}%`}
				subText={`${champion.wins}승 ${champion.games - champion.wins}패`}
			/>

			<StatItem
				label="KDA"
				value={champion.kda.toFixed(2)}
				subText={`${champion.kills.toFixed(1)} / ${champion.deaths.toFixed(1)} / ${champion.assists.toFixed(1)}`}
			/>

			<StatItem
				label="CS"
				value={champion.csPerMinute.toFixed(1)}
				subText={`${champion.averageCs.toFixed(1)}`}
			/>
		</div>
	);
	return (
		<Tooltip content={championInfo}>
			<div className=" flex flex-col justify-center items-center">
				<img
					src={`/champion/${champion.championId}.png`}
					alt={`Champion ${champion.championId}`}
					className="w-8 h-8 rounded-full shrink-0"
				/>
				<span
					className={cn(
						"w-full text-center px-1 py-0.5 rounded-full text-[11px] font-bold -mt-1 text-white leading-none",
						getWinRateColors(champion.winRate).bg,
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
		<dl className="w-full flex gap-5">
			<dt className="bold-14 whitespace-nowrap text-gray-500">{label}</dt>
			<dd className="bold-14 whitespace-nowrap text-gray-100">{value}</dd>
			{subText && (
				<dd className="regular-14 whitespace-nowrap text-gray-100">
					{subText}
				</dd>
			)}
		</dl>
	);
}
