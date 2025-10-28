import type { Tier } from "@/shared/api";
import { capitalize } from "@/shared/lib/capitalize";
import React from "react";
import { getTierIcon } from "../lib/getTierIcon";

export default function TierFullNameBadge({
	tier,
	rank,
}: {
	tier: Tier;
	rank: number;
}) {
	const TierIcon = getTierIcon(tier);

	return (
		<p className="text-gray-800 bold-20 flex gap-1 items-center">
			<TierIcon />
			<span>
				{capitalize(tier)} {tier !== "UNRANKED" && rank}
			</span>
		</p>
	);
}
