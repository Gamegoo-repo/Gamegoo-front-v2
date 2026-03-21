import { getWinRateColors } from "@/entities/game/lib/getWinRateColor";
import type { ChampionStatsResponse } from "@/shared/api";
import { cn } from "@/shared/lib/utils";
import { FlexBox } from "@/shared/ui/flexbox";

interface Props {
	champions: ChampionStatsResponse[];
	className?: string;
}

export default function LolBtiChampionStats({ champions, className }: Props) {
	if (champions.length === 0) {
		return null;
	}

	return (
		<FlexBox
			direction="row"
			align="center"
			justify="center"
			gap="md"
			className={cn(
				"mb-4 w-full min-w-[244px] rounded-[10px] bg-gray-800 px-4 py-2",
				className,
			)}
		>
			{champions.map((champion) => (
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
			))}
		</FlexBox>
	);
}
