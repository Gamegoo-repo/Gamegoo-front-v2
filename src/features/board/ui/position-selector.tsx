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
								className="flex cursor-pointer items-center justify-center rounded-lg p-1 text-gray-700 hover:bg-gray-200"
							>
								{<selected.icon className="h-9 w-9" />}
							</button>
						) : null;
					})()
				) : (
					<button
						type="button"
						className="flex h-8 w-12 cursor-pointer items-center justify-center rounded-full bg-violet-100"
					>
						<PlusIcon />
					</button>
				)}
			</PopoverTrigger>
			<PopoverContent className="popover p-8">
				<PositionSelectorContent
					{...{ selectedPosition, onChangePosition, title }}
				/>
			</PopoverContent>
		</Popover>
	);
}
