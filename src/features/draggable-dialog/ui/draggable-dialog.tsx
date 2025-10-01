import { useEffect } from "react";
import { cn } from "@/shared/lib/utils";
import { useDraggableDialogStore } from "../model/store";
import type { AdjustPositionCallback } from "../model/types";
import { useDrag } from "../model/use-drag";

interface DraggableDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	children: React.ReactNode;
	className?: string;
	adjustPositionCallback?: AdjustPositionCallback;
	showCloseButton?: boolean;
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
	showCloseButton = true,
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
			className="fixed z-[1000]"
			style={{
				top: position.top === "50%" ? "50%" : position.top,
				left: position.left === "50%" ? "50%" : position.left,
				transform:
					position.top === "50%" && position.left === "50%"
						? "translate(-50%, -50%)"
						: "none",
			}}
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
					width: `${width}px`,
					height: `${height}px`,
					borderRadius: "20px",
					boxShadow: "0 4px 46.7px 0 rgba(0,0,0,0.1)",
				}}
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => {
					e.stopPropagation();
				}}
				role="dialog"
				tabIndex={-1}
				aria-modal="true"
			>
				{headerComponent ? (
					<button
						type="button"
						data-drag-handle
						onMouseDown={handleDragStart}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								// Keyboard events can't be used for drag, so we'll ignore this case
							}
						}}
						className="cursor-move w-full text-left"
					>
						{headerComponent}
					</button>
				) : (
					(title || showCloseButton) && (
						<button
							type="button"
							data-drag-handle
							className="flex justify-between items-center relative select-auto cursor-move"
							style={{
								padding: "20px 30px",
								marginBottom: "10px",
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
							{title && (
								<h2 className="text-[20px] font-bold text-gray-800">{title}</h2>
							)}
							{showCloseButton && (
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
									className="w-[25px] h-[25px] flex justify-center items-center absolute top-[12px] right-[12px] opacity-70 hover:opacity-100"
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
							)}
						</button>
					)
				)}

				{children}
			</div>
		</div>
	);
}

export default DraggableDialog;
