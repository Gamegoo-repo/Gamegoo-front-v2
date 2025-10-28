import type { RefObject } from "react";
import type { Position } from "@/shared/api";
import PlusIcon from "@/shared/assets/icons/ic-plus.svg?react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { POSITION_BUTTON_ITEMS } from "../config/position-button-items";
import PositionSelectorContent from "./position-selector-content";

export default function PositionSelector({
	selectedPosition,
	onChangePosition,
	containerRef,
	title,
}: {
	selectedPosition: Position | undefined;
	containerRef: React.RefObject<HTMLDivElement | null>;
	onChangePosition: (newState: Position | undefined) => void;
	title: string;
}) {
	return (
		<Popover containerRef={containerRef as RefObject<HTMLElement>}>
			<PopoverTrigger asChild>
				{selectedPosition ? (
					(() => {
						const selected = POSITION_BUTTON_ITEMS.find(
							(pos) => pos.position === selectedPosition,
						);

						return selected ? (
							<button
								type="button"
								className="p-1 text-gray-700 cursor-pointer hover:bg-gray-200 rounded-lg flex items-center justify-center"
							>
								{<selected.icon className="w-9 h-9" />}
							</button>
						) : null;
					})()
				) : (
					<button
						type="button"
						className="bg-violet-100 h-8 w-12 rounded-full cursor-pointer flex items-center justify-center"
					>
						<PlusIcon />
					</button>
				)}
			</PopoverTrigger>
			<PopoverContent>
				<PositionSelectorContent
					{...{ selectedPosition, onChangePosition, title }}
				/>
			</PopoverContent>
		</Popover>
	);
}
