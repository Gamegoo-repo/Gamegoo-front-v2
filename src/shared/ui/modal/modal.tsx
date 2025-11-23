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
		const dialog = dialogRef.current;
		if (!dialog) {
			return;
		}

		if (isOpen) {
			/** TODO 스크롤 투 탑 안됨 */
			dialog.scrollTo({ top: 0, left: 0, behavior: "instant" });

			// // 스크롤바 너비 계산
			const scrollbarWidth =
				window.innerWidth - document.documentElement.clientWidth;

			// // body 스크롤 막기 + 레이아웃 shift 방지
			document.body.style.overflow = "hidden";
			document.body.style.paddingRight = `${scrollbarWidth}px`;

			dialog.showModal();
		} else {
			document.body.style.overflow = "";
			document.body.style.paddingRight = "";

			dialog.close();
		}

		return () => {
			document.body.style.overflow = "";
			document.body.style.paddingRight = "";
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
