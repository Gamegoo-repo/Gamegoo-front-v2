import { useContext } from "react";
import type { Position } from "@/shared/api";
import { cn } from "@/shared/lib/utils";
import { PopoverContext } from "@/shared/ui/popover/popover";
import PopoverHeader from "@/shared/ui/popover/popover-header";
import { POSITION_BUTTON_ITEMS } from "../config/position-button-items";

export default function PositionSelectorContent({
	selectedPosition,
	onChangePosition,
	title,
}: {
	selectedPosition: Position | undefined;
	onChangePosition: (newState: Position | undefined) => void;
	title: string;
}) {
	const context = useContext(PopoverContext);

	return (
		<div className="flex w-full flex-col gap-7">
			<PopoverHeader title={title} />
			<ul className="flex w-full justify-between">
				{POSITION_BUTTON_ITEMS.map((pos) => {
					const { position, icon: Icon } = pos;
					const isSelected = position === selectedPosition;
					return (
						<li key={position}>
							<button
								type="button"
								className={cn(
									"cursor-pointer rounded-md p-2.5 hover:bg-gray-800",
									isSelected && "bg-violet-700",
								)}
								onClick={() => {
									onChangePosition(
										position === selectedPosition ? undefined : position,
									);
									if (context?.close) {
										context.close();
									}
								}}
							>
								<Icon className="selected w-6.5 text-gray-100" />
							</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
