import { cn } from "@/shared/lib/utils";
import type { PositionIconFn } from "../lib/getPositionIcon";

interface PositionCardProps {
	title?: string;
	size?: "md" | "lg";
	className?: string;
	positionIcons: PositionIconFn[];
}

export default function PositionCard({
	size = "lg",
	title,
	className,
	positionIcons,
}: PositionCardProps) {
	return (
		<div
			className={cn(
				size === "md" &&
					"text-gray-700 medium-11 flex flex-col items-center justify-between",
				size === "lg" &&
					"text-gray-800 text-xs font-bold flex flex-col items-center justify-between",
				className,
			)}
		>
			<span className="w-full text-center">{title}</span>
			<ul className="flex w-full justify-center gap-4 items-end">
				{positionIcons.map((positionIcon) => {
					const PositionIcon = positionIcon;
					return (
						<li
							key={`${title}-position-${crypto.randomUUID()}`}
							className="flex flex-col items-center justify-between"
						>
							<PositionIcon
								className={cn(
									size === "lg" && "w-12 text-gray-700",
									size === "md" && "w-8 text-gray-700",
								)}
							/>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
