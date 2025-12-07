import { useEffect } from "react";
import { cn } from "@/shared/lib/utils";
import { useDrag } from "../hooks/use-drag";
import { useDraggableDialogStore } from "../model/store";
import type { AdjustPositionCallback } from "../model/types";
import "./draggable-dialog.css";

interface DraggableDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	children: React.ReactNode;
	className?: string;
	adjustPositionCallback?: AdjustPositionCallback;
	dragHandleSelector?: string;
	width?: number;
	height?: number;
	variant?: "white" | "violet";
	headerComponent?: React.ReactNode;
}

function DraggableDialog({
	isOpen,
	onOpenChange,
	title,
	children,
	className,
	adjustPositionCallback,
	dragHandleSelector = "[data-drag-handle]",
	width = 420,
	height = 600,
	variant = "white",
	headerComponent,
}: DraggableDialogProps) {
	const { position, setPosition } = useDraggableDialogStore();
	const { handleDragStart, isDragging } = useDrag({
		onPositionChange: setPosition,
		adjustPositionCallback,
	});

	useEffect(() => {
		if (isOpen) {
			const handleDragFromHandle = (e: MouseEvent) => {
				const target = e.target as HTMLElement;
				if (target.closest(dragHandleSelector)) {
					handleDragStart(e as unknown as React.MouseEvent<HTMLElement>);
				}
			};

			document.addEventListener("mousedown", handleDragFromHandle);
			return () => {
				document.removeEventListener("mousedown", handleDragFromHandle);
			};
		}
	}, [isOpen, handleDragStart, dragHandleSelector]);

	if (!isOpen) {
		return null;
	}

	return (
		<div
			data-draggable-container
			className="fixed z-[100]"
			style={
				{
					"--dialog-top": position.top === "50%" ? "50%" : position.top,
					"--dialog-left": position.left === "50%" ? "50%" : position.left,
					"--dialog-transform":
						position.top === "50%" && position.left === "50%"
							? "translate(-50%, -50%)"
							: "none",
					"--dialog-width": `${width}px`,
					"--dialog-height": `${height}px`,
				} as React.CSSProperties
			}
		>
			<div
				className={cn(
					"flex flex-col",
					{
						"bg-white": variant === "white",
						"bg-violet-200": variant === "violet",
					},
					isDragging && "select-none",
					className,
				)}
				style={{
					width: "100%",
					height: "100%",
					borderRadius: "0",
					boxShadow: "none",
				}}
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => {
					e.stopPropagation();
				}}
				role="dialog"
				tabIndex={-1}
				aria-modal="true"
			>
				<div className="relative">
					<button
						type="button"
						data-drag-handle
						className="w-full cursor-default text-left md:cursor-move"
						style={{
							padding: headerComponent ? "0" : "20px 30px",
							marginBottom: headerComponent ? "0" : "10px",
						}}
						onMouseDown={handleDragStart}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								// Keyboard events can't be used for drag, so we'll ignore this case
							}
						}}
						tabIndex={0}
						aria-label="Drag to move dialog"
					>
						{headerComponent ||
							(title && (
								<h2 className="font-bold text-[20px] text-gray-800">{title}</h2>
							))}
					</button>

					{/* 닫기 버튼 - 모든 경우에 position absolute로 표시 */}
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onOpenChange(false);
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								e.stopPropagation();
								onOpenChange(false);
							}
						}}
						onMouseDown={(e) => e.stopPropagation()}
						className="absolute top-[12px] right-[12px] flex h-[25px] w-[25px] items-center justify-center opacity-70 hover:opacity-100"
						aria-label="Close dialog"
					>
						<svg
							width="12"
							height="12"
							viewBox="0 0 12 12"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M11 1L1 11M1 1L11 11"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
				</div>

				{children}
			</div>
		</div>
	);
}

export default DraggableDialog;
