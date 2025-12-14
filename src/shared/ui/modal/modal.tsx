import {
	forwardRef,
	type ReactNode,
	useEffect,
	useImperativeHandle,
	useRef,
} from "react";
import { cn } from "@/shared/lib/utils";
import CloseButton from "../button/close-button";

interface ModalProps {
	className?: string;
	isOpen: boolean;
	isBackdropClosable?: boolean;
	children?: ReactNode;
	onClose: () => void;
	hasCloseButton?: boolean;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
	(
		{
			className,
			isOpen,
			children,
			onClose,
			hasCloseButton = true,
			isBackdropClosable = true,
		},
		forwardedRef,
	) => {
		const dialogRef = useRef<HTMLDialogElement>(null);
		const contentRef = useRef<HTMLDivElement>(null);

		// forwardedRef를 contentRef와 동기화
		useImperativeHandle(
			forwardedRef,
			() => contentRef.current as HTMLDivElement,
			[],
		);

		useEffect(() => {
			const dialog = dialogRef.current;

			if (!dialog) {
				return;
			}

			if (isOpen) {
				document.body.style.cssText = `
					position: fixed; 
					top: -${window.scrollY}px;
					overflow-y: scroll;	
					width: 100%;
				`;
				dialog.showModal();
			} else {
				const scrollY = document.body.style.top;
				document.body.style.cssText = "";
				window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
				try {
					dialog.close();
				} catch (_e) {}
			}
			return () => {
				const scrollY = document.body.style.top;
				document.body.style.cssText = "";
				window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
			};
		}, [isOpen]);

		if (!isOpen) {
			return null;
		}

		return (
			// biome-ignore lint/a11y/useKeyWithClickEvents: The <dialog> element with an onClick handler for backdrop clicks is accessible. Keyboard interaction (ESC key) is handled natively by the dialog element to trigger the onClose event.
			<dialog
				ref={dialogRef}
				onClose={onClose}
				onClick={(e) => {
					if (!isBackdropClosable) return;
					const contentEl = contentRef.current;
					const target = e.target as Node | null;

					if (!contentEl || (target && !contentEl.contains(target))) onClose();
				}}
				className="backdrop:bg-black/62"
			>
				<div
					className={cn(
						"relative rounded-[20px] bg-gray-100 mobile:px-8 px-5 mobile:py-12 py-6",
						className,
					)}
					ref={contentRef}
				>
					{hasCloseButton && (
						<CloseButton
							className="-translate-x-2 absolute top-0 right-0 translate-y-2 hover:rounded-lg hover:bg-gray-300"
							onClose={onClose}
						/>
					)}
					{children}
				</div>
			</dialog>
		);
	},
);

Modal.displayName = "Modal";

export default Modal;
