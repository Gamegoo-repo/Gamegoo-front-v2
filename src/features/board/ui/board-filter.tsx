import { cn } from "@/shared/lib/utils";
import Dropdown from "@/shared/ui/dropdown/dropdown";
import {
	GAME_MODE_ITEMS,
	MIKE_ITEMS,
	TIER_ITEMS,
} from "../config/dropdown-items";
import { POSITION_BUTTON_ITEMS } from "../config/position-button-items";
import { getGameModeTitle } from "../lib/getGameModeTitle";
import { getMike } from "../lib/getMike";
import { getTierTitle } from "../lib/getTierTitle";
import { useBoardFilterStore } from "../model/board-filter-store";

export default function BoardFilter() {
	const { gameMode, tier, mike, setFilter } = useBoardFilterStore();

	return (
		<section className="flex h-full gap-2">
			<Dropdown
				className="h-full w-[138px]"
				selectedLabel={getGameModeTitle(gameMode)}
				onSelect={(value) => setFilter("gameMode", value)}
				items={GAME_MODE_ITEMS}
			/>
			<Dropdown
				selectedLabel={getTierTitle(tier)}
				className="h-full w-[138px]"
				onSelect={(value) => setFilter("tier", value)}
				items={TIER_ITEMS}
			/>
			<Dropdown
				selectedLabel={getMike(mike)}
				className="h-full w-[138px]"
				onSelect={(value) => setFilter("mike", value)}
				items={MIKE_ITEMS}
			/>
			<PositionButtons />
		</section>
	);
}

function PositionButtons() {
	const { position, setFilter } = useBoardFilterStore();

	return (
		<ul className="flex h-full w-[286px] overflow-hidden rounded-lg bg-gray-100">
			{POSITION_BUTTON_ITEMS.map((item) => {
				const Icon = item.icon;
				const isSelected = position === item.position;
				return (
					<li
						key={item.position}
						className="h-full flex-1 cursor-pointer border-gray-300 border-r transition-all ease-in-out last:border-none hover:bg-gray-300"
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
