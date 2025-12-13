import PlusIcon from "@/shared/assets/icons/ic-plus.svg?react";
import { cn } from "@/shared/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import PopoverHeader from "@/shared/ui/popover/popover-header";
import { GAME_STYLE } from "../config/game-styles";

export default function GameStylePopover({
	selectedGameStyle,
	onChangeGameStyle,
	containerRef,
}: {
	selectedGameStyle: number[];
	onChangeGameStyle: (selectedId: number) => void;
	containerRef?: React.RefObject<HTMLElement | null>;
}) {
	return (
		<Popover containerRef={containerRef}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="flex h-7 mobile:h-8 mobile:w-12 w-10 cursor-pointer items-center justify-center rounded-full bg-white"
				>
					<PlusIcon />
				</button>
			</PopoverTrigger>
			<PopoverContent className="popover w-[500px] p-8">
				<div className="flex w-full flex-col gap-7">
					<PopoverHeader title="게임 스타일 선택 *최대 3개" />
					<div className="flex w-full flex-wrap gap-2">
						{GAME_STYLE.map((item) => {
							const isSelected = selectedGameStyle.includes(item.gameStyleId);
							return (
								<button
									type="button"
									key={item.gameStyleId}
									onClick={() => onChangeGameStyle(item.gameStyleId)}
									className={cn(
										"medium-14 cursor-pointer rounded-full border-1 border-gray-500 px-5 py-1.5 text-white hover:border-violet-400 hover:text-violet-300",
										isSelected &&
											"border-violet-600 bg-violet-600 hover:border-violet-600 hover:text-white",
									)}
								>
									{item.gameStyleName}
								</button>
							);
						})}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
