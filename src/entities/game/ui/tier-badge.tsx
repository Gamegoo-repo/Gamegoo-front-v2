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
		<div className="flex items-center justify-center gap-0.5">
			<TierIcon className="text-gray-700" />
			<span className="text-gray-800 bold-16">{`${tier?.charAt(0)}${rank}`}</span>
		</div>
	);
}
