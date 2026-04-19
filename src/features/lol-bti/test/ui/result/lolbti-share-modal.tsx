import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/lib/utils";
import type { LolBtiResultType } from "../../config";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	result: LolBtiResultType;
	title?: string;
	children: React.ReactNode;
	closeOnBackdropClick?: boolean;
}

const ANIMATION_DURATION_MS = 300;

function useModalAnimation(isOpen: boolean) {
	const [mounted, setMounted] = useState(isOpen);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setMounted(true);
			const timer = setTimeout(() => setVisible(true), 0);
			return () => clearTimeout(timer);
		} else {
			setVisible(false);
			// transition이 끝난 뒤 DOM에서 제거
			const timer = setTimeout(() => setMounted(false), ANIMATION_DURATION_MS);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	return { mounted, visible };
}

export default function LolBtiShareModal({
	isOpen,
	onClose,
	result,
	title,
	children,
	closeOnBackdropClick = true,
}: ModalProps) {
	const { mounted, visible } = useModalAnimation(isOpen);
	const closeBtnRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!isOpen) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [isOpen, onClose]);

	useEffect(() => {
		if (!isOpen) return;
		const scrollY = window.scrollY;
		document.body.style.cssText = `position:fixed;top:-${scrollY}px;width:100%;overflow-y:scroll;`;
		return () => {
			document.body.style.cssText = "";
			window.scrollTo(0, scrollY);
		};
	}, [isOpen]);

	useEffect(() => {
		if (visible) closeBtnRef.current?.focus();
	}, [visible]);

	if (!mounted) return null;

	const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (closeOnBackdropClick && e.target === e.currentTarget) onClose();
	};

	return createPortal(
		<div
			role="dialog"
			aria-modal="true"
			aria-label={title}
			className={cn(
				"fixed inset-0 z-50",
				"flex items-end justify-center",
				"transition-colors duration-300",
				visible ? "md:bg-black/50" : "md:bg-black/0",
			)}
			onClick={handleWrapperClick}
		>
			<div
				className={cn(
					"relative flex flex-col rounded-t-3xl bg-gray-800 pb-10",
					"h-full w-full",
					// 'md:h-auto md:max-h-[85vh] md:rounded-2xl md:shadow-2xl',
					"h-fit mobile:w-[440px]",
					"transition-all duration-300 ease-out",
					visible
						? "translate-y-0 opacity-100 md:scale-100"
						: "translate-y-full md:translate-y-0 md:scale-95 md:opacity-0",
				)}
			>
				<div className="flex w-full items-center justify-center py-2">
					<div className="h-[3px] w-9 rounded-full bg-white" />
				</div>

				<div className="flex w-full items-center justify-center pt-4 pb-6">
					<img
						className="w-[170px]"
						src={`/assets/images/result-cards/${result}.png`}
						alt={`${result} 결과 카드`}
					/>
				</div>

				<div className="flex w-full items-center gap-4 border-t-[1px] border-t-gray-700 px-5 py-4">
					{children}
				</div>
			</div>
		</div>,
		document.body,
	);
}
