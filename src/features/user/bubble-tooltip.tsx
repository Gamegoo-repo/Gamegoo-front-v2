import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";

type BubbleVariant = "sm" | "lg";
type BubbleAlign = "center" | "left" | "right";

interface BubbleTooltipProps {
	variant?: BubbleVariant;
	align?: BubbleAlign;
	message?: string;
}

export default function BubbleTooltip({
	variant = "sm",
	align = "center",
	message = "클릭해서 매너키워드 보기",
}: BubbleTooltipProps) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const initialShow = setTimeout(() => {
			setIsVisible(true);
		}, 200);

		const interval = setInterval(() => {
			setIsVisible((prev) => !prev);
		}, 4000);

		return () => {
			clearTimeout(initialShow);
			clearInterval(interval);
		};
	}, []);

	// Variant-specific top offsets as class names
	const VARIANT_TOP_CLASS: Record<BubbleVariant, string> = {
		sm: "top-[6px]",
		lg: "top-[20px]",
	};
	const ALIGN_CLASS: Record<BubbleAlign, string> = {
		center: "left-1/2",
		left: "left-0",
		right: "right-0",
	};

	return (
		<div
			className={cn(
				"pointer-events-none absolute z-10 transition-all duration-500 ease-out",
				VARIANT_TOP_CLASS[variant],
				ALIGN_CLASS[align],
				align === "center" && "-translate-x-1/2",
				isVisible
					? "translate-y-0 opacity-100"
					: "translate-y-[10px] opacity-0",
			)}
		>
			{/* 말풍선 본체 */}
			<div className="-translate-x-1/2 absolute bottom-[10px] left-1/2 whitespace-nowrap rounded-[46px] border border-violet-400 bg-gray-100 px-[13px] py-[7px] shadow-[0_4px_14px_rgba(90,66,238,0.14)]">
				<p className="font-medium text-[11px] text-gray-800">{message}</p>
			</div>
		</div>
	);
}
