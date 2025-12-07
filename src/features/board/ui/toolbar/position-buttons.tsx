import { cn } from "@/shared/lib/utils";
import { POSITION_BUTTON_ITEMS } from "../../config/position-button-items";
import { useBoardFilterStore } from "../../model/board-filter-store";

export default function PositionButtons() {
	const { position, setFilter } = useBoardFilterStore();

	return (
		<ul className="flex h-full w-full overflow-hidden rounded-lg bg-gray-100">
			{POSITION_BUTTON_ITEMS.map((item) => {
				const Icon = item.icon;
				const isSelected = position === item.position;
				return (
					<li
						key={item.position}
						className="aspect-square h-full flex-1 cursor-pointer border-gray-300 border-r transition-all ease-in-out last:border-none hover:bg-gray-300"
					>
						<button
							type="button"
							className={cn(
								"flex h-full w-full cursor-pointer items-center justify-center",
								isSelected && "bg-gray-700 hover:bg-gray-600",
							)}
							onClick={() => setFilter("position", item.position)}
						>
							<Icon
								className={cn(
									"position-icon w-6 text-gray-500",
									isSelected && "selected text-gray-100",
								)}
							/>
						</button>
					</li>
				);
			})}
		</ul>
	);
}
