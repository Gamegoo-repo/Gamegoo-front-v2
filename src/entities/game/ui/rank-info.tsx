import type { Tier } from "@/shared/api";
import TierLabel from "./tier-label";

interface RankInfoProps {
	label: string;
	tier: Tier;
	rank: number;
	tierClassName?: string;
}

export default function RankInfo({
	label,
	tier,
	rank,
	tierClassName,
}: RankInfoProps) {
	return (
		<div className="flex flex-col gap-0.5 w-[180px]">
			<span className="text-gray-600 medium-14">{label}</span>
			<TierLabel tier={tier} rank={rank} className={tierClassName} />
		</div>
	);
}
