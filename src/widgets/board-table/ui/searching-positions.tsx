import { getPositionIcon } from "@/entities/game/lib/getPositionIcon";
import type { Position } from "@/shared/api";

export default function SearchingPosition({
	wantingPositions,
}: {
	wantingPositions: Position[];
}) {
	return (
		<ul className="flex gap-0.5 justify-center">
			{wantingPositions.map((pos, idx) => {
				const PositionIcon = getPositionIcon(pos);
				return (
					<li key={idx}>
						<PositionIcon className="w-8 text-gray-700" />
					</li>
				);
			})}
		</ul>
	);
}
