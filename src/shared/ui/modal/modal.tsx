import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/shared/lib/utils";
import CloseButton from "../button/close-button";

export default function Modal({
	className,
	isOpen,
	children,
	onClose,
	contentRef,
	hideCloseButton = false,
	closeOnBackdrop = true,
}: {
	className?: string;
	isOpen: boolean;
	children?: ReactNode;
	onClose: () => void;
	contentRef?: React.RefObject<HTMLDivElement | null>;
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
			// lock scroll
			document.body.style.cssText = `
    position: fixed; 
    top: -${window.scrollY}px;
    overflow-y: scroll;	
    width: 100%;`;
			dialog.showModal();
		} else {
			// unlock scroll and close
			const scrollY = document.body.style.top;
			document.body.style.cssText = "";
			window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
			try {
				dialog.close();
			} catch (_e) {
				// ignore if already closed
			}
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
			onClick={(e) => {
				if (!closeOnBackdrop) return;
				const contentEl = contentRef?.current;
				const target = e.target as Node | null;
				// 닫기: 컨텐츠 영역 밖을 클릭한 경우
				if (!contentEl || (target && !contentEl.contains(target))) onClose();
			}}
			onKeyDown={(e) => {
				if (!closeOnBackdrop) return;
				// ESC는 native로 처리되지만, 키보드 이벤트 존재로 a11y 린터 충족
				if (e.key === "Escape") {
					onClose();
				}
			}}
			className="backdrop:bg-black/62"
		>
			<div
				className={cn(
					"relative rounded-[20px] bg-gray-100 px-8 py-12",
					className,
				)}
				ref={contentRef}
			>
				{!hideCloseButton && (
					<CloseButton
						className="-translate-x-2 absolute top-0 right-0 translate-y-2 hover:rounded-lg hover:bg-gray-300"
						onClose={onClose}
					/>
				)}
				{children}
			</div>
		</dialog>
	);
}
