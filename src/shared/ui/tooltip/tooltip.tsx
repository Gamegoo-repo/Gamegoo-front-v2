import { type ReactNode, useState } from "react";
import { cn } from "@/shared/lib/utils";

type ArrowPosition = "left" | "center" | "right";

interface TooltipProps {
	children: ReactNode;
	content: string | ReactNode;
	arrowPosition?: ArrowPosition;
	showOnHover?: boolean;
	className?: string;
}

export default function Tooltip({
	children,
	content,
	arrowPosition = "center",
	showOnHover = true,
	className,
}: TooltipProps) {
	const [isVisible, setIsVisible] = useState(false);

	const getTooltipBodyPositionClass = () => {
		switch (arrowPosition) {
			case "left":
				return "left-0 -translate-x-3";
			case "center":
				return "left-1/2 -translate-x-1/2";
			case "right":
				return "right-0 translate-x-3";
			default:
				return "left-1/2 -translate-x-1/2";
		}
	};

	const handleMouseEnter = () => {
		if (showOnHover) {
			setIsVisible(true);
		}
	};

	const handleMouseLeave = () => {
		if (showOnHover) {
			setIsVisible(false);
		}
	};

	const handleClick = () => {
		if (!showOnHover) {
			setIsVisible(!isVisible);
		}
	};

	return (
		<div
			className="relative inline-block"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onClick={handleClick}
		>
			{children}

			{isVisible && (
				<div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50">
					<div
						className="w-[10px] h-[10px] bg-black/64 rotate-45 -translate-y-[5px]"
						style={{
							filter: "drop-shadow(0 2.787px 6.201px rgba(0, 0, 0, 0.25))",
							backdropFilter: "blur(5.26px)",
						}}
					/>

					<div
						className={cn(
							"absolute top-0 text-white p-5 rounded-xl min-w-[200px]",
							getTooltipBodyPositionClass(),
							className,
						)}
						style={{
							background: "rgba(0, 0, 0, 0.70)",
							boxShadow: "0 2.787px 6.201px 0 rgba(0, 0, 0, 0.25)",
							backdropFilter: "blur(5.26px)",
						}}
					>
						{content}
					</div>
				</div>
			)}
		</div>
	);
}
