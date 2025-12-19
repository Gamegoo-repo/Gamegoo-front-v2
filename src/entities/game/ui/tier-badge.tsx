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
		<div className="flex min-w-[100px] items-center justify-center gap-0.5">
			<TierIcon className="h-[32px] w-[32px] text-gray-700" />
			<span className="bold-20 text-gray-800">{`${tier?.charAt(0)}${rank}`}</span>
		</div>
	);
}
