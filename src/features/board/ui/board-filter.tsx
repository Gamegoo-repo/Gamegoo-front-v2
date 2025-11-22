import { useEffect } from "react";
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
		<section className="h-full flex gap-2">
			<Dropdown
				className="w-[138px]"
				selectedLabel={getGameModeTitle(gameMode)}
				size="lg"
				onSelect={(value) => setFilter("gameMode", value)}
				items={GAME_MODE_ITEMS}
			/>
			<Dropdown
				selectedLabel={getTierTitle(tier)}
				size="lg"
				className="w-[138px]"
				onSelect={(value) => setFilter("tier", value)}
				items={TIER_ITEMS}
			/>
			<Dropdown
				selectedLabel={getMike(mike)}
				size="lg"
				className="w-[138px]"
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
		<ul className="h-full w-[286px] flex rounded-lg bg-gray-100 overflow-hidden ">
			{POSITION_BUTTON_ITEMS.map((item) => {
				const Icon = item.icon;
				const isSelected = position === item.position;
				return (
					<li
						key={item.position}
						className="cursor-pointer h-full flex-1 border-r border-gray-300 last:border-none transition-all ease-in-out hover:bg-gray-300"
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
