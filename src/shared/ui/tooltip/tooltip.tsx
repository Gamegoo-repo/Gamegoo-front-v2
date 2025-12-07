import {
	cloneElement,
	type ReactElement,
	type ReactNode,
	useState,
} from "react";
import { cn } from "@/shared/lib/utils";

type ArrowPosition = "left" | "center" | "right";

interface TooltipProps {
	children: ReactElement;
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

	const triggerElement = cloneElement(children, {
		onMouseEnter: handleMouseEnter,
		onMouseLeave: handleMouseLeave,
		onClick: handleClick,
	} as React.HTMLAttributes<HTMLElement>);

	return (
		<div className="relative inline-block">
			{triggerElement}

			{isVisible && (
				<div className="-translate-x-1/2 absolute top-full left-1/2 z-50 mt-2">
					<div
						className="-translate-y-[5px] h-[10px] w-[10px] rotate-45 bg-black/64"
						style={{
							filter: "drop-shadow(0 2.787px 6.201px rgba(0, 0, 0, 0.25))",
							backdropFilter: "blur(5.26px)",
						}}
					/>

					<div
						className={cn(
							"absolute top-0 min-w-[200px] rounded-xl p-5 text-white",
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
