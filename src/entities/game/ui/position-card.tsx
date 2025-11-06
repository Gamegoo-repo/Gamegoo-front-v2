import { cn } from "@/shared/lib/utils";
import type { PositionIconFn } from "../lib/getPositionIcon";

interface PositionCardProps {
	title?: string;
	className?: string;
	positionIcons: PositionIconFn[];
}

export default function PositionCard({
	title,
	className,
	positionIcons,
}: PositionCardProps) {
	return (
		<div
			className={cn(
				"text-gray-700 text-xs font-bold flex flex-col items-center justify-between",
				className,
			)}
		>
			<span className="w-full text-center">{title}</span>
			<ul className="flex w-full justify-center gap-4 items-end">
				{positionIcons.map((positionIcon, idx) => {
					const PositionIcon = positionIcon;
					return (
						<li
							key={`${title}-position-${idx}`}
							className="flex flex-col items-center justify-between"
						>
							<PositionIcon className="w-12 text-gray-700" />
						</li>
					);
				})}
			</ul>
		</div>
	);
}
