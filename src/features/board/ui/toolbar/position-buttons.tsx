import { cn } from "@/shared/lib/utils";
import { POSITION_BUTTON_ITEMS } from "../../config/position-button-items";
import { useBoardFilterStore } from "../../model/board-filter-store";

export default function PositionButtons() {
	const { position, setFilter } = useBoardFilterStore();

	return (
		<ul className="h-full w-full mobile:w-[286px] flex rounded-lg bg-gray-100 overflow-hidden">
			{POSITION_BUTTON_ITEMS.map((item) => {
				const Icon = item.icon;
				const isSelected = position === item.position;
				return (
					<li
						key={item.position}
						className="aspect-square cursor-pointer h-full flex-1 border-r border-gray-300 last:border-none transition-all ease-in-out hover:bg-gray-300"
					>
						<button
							type="button"
							className={cn(
								"cursor-pointer w-full h-full flex items-center justify-center",
								isSelected && "bg-gray-700 hover:bg-gray-600",
							)}
							onClick={() => setFilter("position", item.position)}
						>
							<Icon
								className={cn(
									"w-6 position-icon text-gray-500",
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
