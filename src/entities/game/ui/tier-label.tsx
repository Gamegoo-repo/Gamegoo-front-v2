import type { Tier } from "@/shared/api";
import { capitalize } from "@/shared/lib/capitalize";
import { cn } from "@/shared/lib/utils";
import { getTierIcon } from "../lib/getTierIcon";

export default function TierLabel({
	size = "lg",
	tier,
	rank,
	className,
}: {
	size?: "md" | "lg";
	tier: Tier;
	rank: number;
	className?: string;
}) {
	const TierIcon = getTierIcon(tier);

	return (
		<p
			className={cn(
				"items-center text-gray-800",
				size === "lg" && " bold-20 flex gap-1",
				size === "md" && " bold-12 flex gap-0.5",
				className,
			)}
		>
			<TierIcon className={cn(size === "md" && "w-6")} />
			<span>
				{capitalize(tier)} {tier !== "UNRANKED" && rank}
			</span>
		</p>
	);
}
