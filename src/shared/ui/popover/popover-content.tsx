import { type CSSProperties, type ReactNode, useContext } from "react";
import { createPortal } from "react-dom";
import { PopoverContext } from "./popover";

// import type { Align, Side } from "./popover-type";

interface PopoverContentProps {
	children: ReactNode;
	className?: string;
	// side?: Side;
	// align?: Align;
	showArrow?: boolean;
	portal?: boolean;
}

export function PopoverContent({
	children,
	className = "",
	// side = "bottom",
	// align = "center",
	showArrow = true,
	portal = true,
}: PopoverContentProps) {
	const context = useContext(PopoverContext);

	if (!context) {
		throw new Error("PopoverContent must be used within a Popover");
	}

	const { isOpen, position, contentRef, isCalculated, useAbsolute } = context;

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

	const content = (
		<div
			ref={contentRef}
			className={`${useAbsolute ? "absolute" : "fixed"} ${className}`}
			style={{
				left: isCalculated ? `${position.x}px` : `-99999px`,
				top: isCalculated ? `${position.y}px` : `-99999px`,
				visibility: isCalculated ? "visible" : "hidden",
				// 모달(z-[1000])보다 위
				zIndex: 2001,
			}}
		>
			{/** 화살표 */}
			{showArrow && <div style={arrowStyle} />}

			{/** 컨텐츠 */}
			{children}
		</div>
	);

	// Portal로 렌더링하여 부모의 overflow/stacking context 영향을 피함
	if (portal && typeof document !== "undefined") {
		return createPortal(content, document.body);
	}

	return content;
}
