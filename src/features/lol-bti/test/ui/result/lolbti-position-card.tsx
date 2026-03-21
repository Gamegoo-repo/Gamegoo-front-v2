interface LolBtiPositionCardProps {
	position: string;
	champions: { name: string; championId: number }[];
}

export function LolBtiPositionCard({
	position,
	champions,
}: LolBtiPositionCardProps) {
	return (
		<div className="flex w-full flex-col items-center gap-2 rounded-[10px] border-1 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-8 py-5">
			<span className="font-semibold text-[#bfbfbf] text-lg">{position}</span>
			<div className="flex w-full flex-col gap-2">
				{champions.map((champion) => (
					<div
						key={champion.name}
						className="flex w-full items-center gap-2 rounded-full border border-white/10 bg-[rgba(255,255,255,0.08)] px-3 py-2"
					>
						<img
							src={`https://cdn.communitydragon.org/latest/champion/${champion.championId}/square`}
							alt={champion.name}
							className="size-9 rounded-full object-cover"
						/>
						<span className="font-medium text-[#bfbfbf] text-base">
							{champion.name}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
