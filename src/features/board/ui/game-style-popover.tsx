import type { RefObject } from "react";
import PlusIcon from "@/shared/assets/icons/ic-plus.svg?react";
import { cn } from "@/shared/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { GAME_STYLE } from "../config/game-styles";
import PopoverHeader from "@/shared/ui/popover/popover-header";

export default function GameStylePopover({
	selectedGameStyle,
	onChangeGameStyle,
	containerRef,
}: {
	selectedGameStyle: number[];
	onChangeGameStyle: (selectedId: number) => void;
	containerRef: React.RefObject<HTMLDivElement | null>;
}) {
	return (
		<Popover containerRef={containerRef as RefObject<HTMLElement>}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="bg-white h-8 w-12 rounded-full cursor-pointer flex items-center justify-center"
				>
					<PlusIcon />
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-[500px]">
				<div className="w-full flex flex-col gap-7">
					<PopoverHeader title="게임 스타일 선택 *최대 3개" />
					<div className="w-full flex flex-wrap gap-2">
						{GAME_STYLE.map((item) => {
							const isSelected = selectedGameStyle.includes(item.gameStyleId);
							return (
								<button
									type="button"
									key={item.gameStyleId}
									onClick={() => onChangeGameStyle(item.gameStyleId)}
									className={cn(
										"cursor-pointer border-1 border-gray-500 rounded-full px-5 py-1.5 text-white medium-14 hover:text-violet-300 hover:border-violet-400",
										isSelected &&
											"bg-violet-600 border-violet-600 hover:text-white hover:border-violet-600",
									)}
								>
									{item.gameStyleName}
								</button>
							);
						})}
					</div>
					{/* <small className="text-red-600">
						게임 스타일은 최대 3개까지 선택 가능합니다.
					</small> */}
				</div>
			</PopoverContent>
		</Popover>
	);
}
