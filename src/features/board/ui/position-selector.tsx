import type { ComponentPropsWithoutRef, RefObject } from "react";
import type { Position } from "@/shared/api";
import PlusIcon from "@/shared/assets/icons/ic-plus.svg?react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { POSITION_BUTTON_ITEMS } from "../config/position-button-items";
import PositionSelectorContent from "./position-selector-content";
import { cn } from "@/shared/lib/utils";

export interface PositionSelectorProps
	extends Omit<ComponentPropsWithoutRef<"button">, "onChange"> {
	/** 라벨 텍스트 */
	label?: string;
	/** 선택된 포지션 */
	selectedPosition?: Position;
	/** 포지션 변경 핸들러 */
	onChangePosition: (position: Position | undefined) => void;
	/** Popover 제목 (접근성용) */
	title?: string;
	/** 필수 입력 여부 */
	required?: boolean;
	/** 에러 여부 */
	isError?: boolean;
	/** 부가 설명 텍스트 */
	supportingText?: string;
	/** Popover를 렌더링할 컨테이너 */
	containerRef?: RefObject<HTMLElement | null>;
}

export default function PositionSelector({
	label,
	selectedPosition,
	onChangePosition,
	title = "포지션 선택",
	required = false,
	isError = false,
	supportingText,
	containerRef,
	className,
	...attributes
}: PositionSelectorProps) {
	const selectedItem = selectedPosition
		? POSITION_BUTTON_ITEMS.find((pos) => pos.position === selectedPosition)
		: null;

	return (
		<div className={cn("flex flex-col items-center mobile:gap-2", className)}>
			{label && (
				<label className="font-medium mobile:font-bold text-[11px] text-gray-700 text-xs">
					{label}
				</label>
			)}

			{/* Position Selector UI */}
			<Popover containerRef={containerRef}>
				<PopoverTrigger asChild>
					<div className="flex h-10 mobile:h-12 mobile:w-12 w-10 items-center justify-center">
						{selectedItem ? (
							<button
								type="button"
								aria-label={label || title}
								className={cn(
									"flex cursor-pointer items-center justify-center rounded-lg p-1 text-gray-700 transition-colors hover:bg-gray-200",
									isError && "ring-2 ring-red-500",
								)}
								{...attributes}
							>
								<selectedItem.icon className="h-7 mobile:h-9 mobile:w-9 w-7" />
							</button>
						) : (
							<button
								type="button"
								aria-label={label || title}
								className={cn(
									"flex h-6 mobile:h-8 mobile:w-12 w-8 cursor-pointer items-center justify-center rounded-full bg-violet-100 transition-colors hover:bg-violet-200",
									isError && "ring-2 ring-red-500",
								)}
								{...attributes}
							>
								<PlusIcon />
							</button>
						)}
					</div>
				</PopoverTrigger>
				<PopoverContent className="popover p-8">
					<PositionSelectorContent
						selectedPosition={selectedPosition}
						onChangePosition={onChangePosition}
						title={title}
					/>
				</PopoverContent>
			</Popover>

			{/* Supporting Text (Select 패턴) */}
			{supportingText && (
				<small
					className={cn("text-xs", isError ? "text-red-500" : "text-gray-500")}
				>
					{supportingText}
				</small>
			)}
		</div>
	);
}
