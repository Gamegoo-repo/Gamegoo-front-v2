import type { Tier } from "@/shared/api";
import { capitalize } from "@/shared/lib/capitalize";
import { cn } from "@/shared/lib/utils";
import { getTierIcon } from "../lib/getTierIcon";

export default function TierLabel({
	tier,
	rank,
	className,
}: {
	tier: Tier;
	rank: number;
	className?: string;
}) {
	const TierIcon = getTierIcon(tier);

	return (
		<p
			className={cn("text-gray-800 bold-20 flex gap-1 items-center", className)}
		>
			<TierIcon />
			<span>
				{capitalize(tier)} {tier !== "UNRANKED" && rank}
			</span>
		</p>
	);
}
