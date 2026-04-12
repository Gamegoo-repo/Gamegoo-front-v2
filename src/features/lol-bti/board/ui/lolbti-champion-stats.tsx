import { getWinRateColors } from "@/entities/game/lib/getWinRateColor";
import type { ChampionStatsResponse } from "@/shared/api";
import { cn } from "@/shared/lib/utils";
import { FlexBox } from "@/shared/ui/flexbox";

interface Props {
	champions: ChampionStatsResponse[];
	className?: string;
}

export default function LolBtiChampionStats({ champions, className }: Props) {
	return (
		<FlexBox
			direction="row"
			align="center"
			justify="center"
			gap="md"
			className={cn(
				"mb-4 h-[73px] w-full min-w-[244px] rounded-[10px] bg-gray-800 px-4 py-2",
				className,
			)}
		>
			{champions.length > 0 ? (
				champions.map((champion) => (
					<div
						key={champion.championId}
						className="flex flex-col items-center justify-center"
					>
						<img
							src={`/champion/${champion.championId}.png`}
							alt={champion.championName}
							className={cn("size-11 shrink-0 rounded-full")}
						/>
						<span
							className={cn(
								"-mt-1 flex min-w-10 items-center justify-center rounded-full px-1 text-center font-bold text-[11px] text-white leading-normal",
								getWinRateColors(champion.winRate).bg,
							)}
						>
							{Math.round(champion.winRate)}%
						</span>
					</div>
				))
			) : (
				<span className="text-gray-500 text-xs">
					최근 플레이 정보가 없습니다.
				</span>
			)}
		</FlexBox>
	);
}
