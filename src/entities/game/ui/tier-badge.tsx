import type { Tier } from "@/shared/api";
import { getTierIcon } from "../lib/getTierIcon";

export default function TierBadge({
	tier,
	rank,
}: {
	tier: Tier;
	rank: number;
}) {
	const TierIcon = getTierIcon(tier);
	return (
		<div className="flex gap-0.5 min-w-[100px]">
			<TierIcon className="text-gray-700 width-[32px] height-[32px]" />
			<span className="text-gray-800 bold-20">{`${tier?.charAt(0)}${rank}`}</span>
		</div>
	);
}
