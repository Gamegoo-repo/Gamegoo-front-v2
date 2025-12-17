import {
	forwardRef,
	type ReactNode,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/lib/utils";
import CloseButton from "../button/close-button";

export interface ModalProps {
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
		const contentRef = useRef<HTMLDivElement>(null);

		const handleEscKeyPress = useCallback(
			(event: KeyboardEvent) => {
				if (event.key === "Escape" && isBackdropClosable) {
					onClose();
				}
			},
			[onClose, isBackdropClosable],
		);

		// forwardedRef를 contentRef와 동기화
		useImperativeHandle(
			forwardedRef,
			() => contentRef.current as HTMLDivElement,
			[],
		);

		useEffect(() => {
			if (isOpen) {
				document.body.style.cssText = `
					position: fixed; 
					top: -${window.scrollY}px;
					overflow-y: scroll;	
					width: 100%;
				`;

				window.addEventListener("keydown", handleEscKeyPress);
			} else {
				const scrollY = document.body.style.top;
				document.body.style.cssText = "";
				window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
			}
			return () => {
				const scrollY = document.body.style.top;
				document.body.style.cssText = "";
				window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
				window.removeEventListener("keydown", handleEscKeyPress);
			};
		}, [isOpen, handleEscKeyPress]);

		if (!isOpen) {
			return null;
		}

		const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
			if (isBackdropClosable && e.target === e.currentTarget) {
				onClose();
			}
		};

		return createPortal(
			// biome-ignore lint/a11y/useKeyWithClickEvents: Backdrop click is handled with ESC key listener
			<div onClick={handleBackdropClick} className="modal-backdrop z-[1000]">
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: Click propagation stop is intentional for modal content */}
				<div
					className={cn(
						"relative rounded-[20px] bg-gray-100 mobile:px-8 px-5 mobile:py-8 py-6",
						className,
					)}
					ref={contentRef}
					onClick={(e) => e.stopPropagation()}
				>
					{hasCloseButton && (
						<CloseButton
							className="-translate-x-2 absolute top-0 right-0 translate-y-2 hover:rounded-lg hover:bg-gray-300"
							onClose={onClose}
						/>
					)}
					{children}
				</div>
			</div>,
			document.getElementById("modal-root") || document.body,
		);
	},
);

Modal.displayName = "Modal";

export default Modal;
