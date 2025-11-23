import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/shared/lib/utils";
import CloseButton from "../button/close-button";

export default function Modal({
	className,
	isOpen,
	children,
	onClose,
	ref,
	hideCloseButton = false,
	closeOnBackdrop = true,
}: {
	className?: string;
	isOpen: boolean;
	children?: ReactNode;
	onClose: () => void;
	ref: React.RefObject<HTMLDivElement | null>;
	hideCloseButton?: boolean;
	closeOnBackdrop?: boolean;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		document.body.style.cssText = `
    position: fixed; 
    top: -${window.scrollY}px;
    overflow-y: scroll;	
    width: 100%;`;

		const dialog = dialogRef.current;

		if (!dialog) {
			return;
		}

		if (isOpen) {
			dialog.showModal();
		}
		return () => {
			const scrollY = document.body.style.top;
			document.body.style.cssText = "";
			window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
		};
	}, [isOpen]);

	return (
		<dialog
			ref={dialogRef}
			onClose={onClose}
			onMouseDown={(e) => {
				if (!closeOnBackdrop) return;
				if (e.target === e.currentTarget) {
					onClose();
				}
			}}
			className="backdrop:bg-black/62"
		>
			<div
				className={cn(
					"relative bg-gray-100 rounded-[20px] px-8 py-12",
					className,
				)}
				ref={ref}
			>
				{!hideCloseButton && (
					<CloseButton
						className="absolute right-0 top-0 hover:bg-gray-300 hover:rounded-lg translate-y-2 -translate-x-2"
						onClose={onClose}
					/>
				)}
				{children}
			</div>
		</dialog>
	);
}
