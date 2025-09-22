import { useEffect, useState } from "react";
import type { AdjustPositionCallback, DragOffset, Position } from "./types";

interface UseDragParams {
	onPositionChange: (position: Position) => void;
	adjustPositionCallback?: AdjustPositionCallback;
}

interface UseDragReturn {
	handleDragStart: (e: React.MouseEvent<HTMLElement>) => void;
	isDragging: boolean;
}

export const useDrag = ({
	onPositionChange,
	adjustPositionCallback,
}: UseDragParams): UseDragReturn => {
	const [isDragging, setIsDragging] = useState(false);
	const [offset, setOffset] = useState<DragOffset>({ x: 0, y: 0 });

	const handleDragStart = (e: React.MouseEvent<HTMLElement>) => {
		setIsDragging(true);

		// Find the draggable container (should have position fixed/absolute)
		const draggableElement = e.currentTarget.closest(
			"[data-draggable-container]",
		) as HTMLElement;

		if (draggableElement) {
			const rect = draggableElement.getBoundingClientRect();
			setOffset({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			});
		}
	};

	const handleDrag = (e: MouseEvent) => {
		if (!isDragging) return;

		const left = `${e.clientX - offset.x}px`;
		const top = `${e.clientY - offset.y}px`;

		const newPosition = { top, left };
		const adjustedPosition = adjustPositionCallback
			? adjustPositionCallback(newPosition)
			: newPosition;

		onPositionChange(adjustedPosition);
	};

	const handleDragEnd = () => {
		setIsDragging(false);
	};

	useEffect(() => {
		if (isDragging) {
			const handleMouseMove = (e: MouseEvent) => handleDrag(e);
			const handleMouseUp = () => handleDragEnd();

			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);

			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};
		}
	}, [isDragging]);

	return { handleDragStart, isDragging };
};
