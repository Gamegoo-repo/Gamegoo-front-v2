import { type CSSProperties, type ReactNode, useContext } from "react";
import { PopoverContext } from "./popover";

interface PopoverContentProps {
	children: ReactNode;
	className?: string;
}

export function PopoverContent({
	children,
	className = "",
}: PopoverContentProps) {
	const context = useContext(PopoverContext);

	if (!context) {
		throw new Error("PopoverContent must be used within a Popover");
	}

	const { isOpen, position, contentRef, isCalculated } = context;

	if (!isOpen) return null;

	const arrowStyle: CSSProperties = {
		position: "absolute",
		left: `${position.arrowX}px`,
		transform: "translateX(-50%)",
		width: 0,
		height: 0,
		borderStyle: "solid",
		zIndex: 1,
	};

	if (position.arrowPosition === "top") {
		arrowStyle.top = "-8px";
		arrowStyle.borderWidth = "0 8px 8px 8px";
		arrowStyle.borderColor =
			"transparent transparent rgba(0, 0, 0, 0.7) transparent";
		arrowStyle.filter = "drop-shadow(0 4px 8.9px rgba(0, 0, 0, 0.25))";
	} else {
		arrowStyle.bottom = "-8px";
		arrowStyle.borderWidth = "8px 8px 0 8px";
		arrowStyle.borderColor =
			"rgba(0, 0, 0, 0.7)  transparent transparent transparent";
		arrowStyle.filter = "drop-shadow(0 2px 2px rgba(0,0,0,0.05))";
	}

	return (
		<div
			ref={contentRef}
			className={`popover fixed z-50 w-[388px] p-8 ${className}`}
			style={{
				left: `${position.x}px`,
				top: `${position.y}px`,
				visibility: isCalculated ? "visible" : "hidden",
			}}
		>
			{/** 화살표 */}
			<div style={arrowStyle} />

			{/** 컨텐츠 */}
			{children}
		</div>
	);
}
