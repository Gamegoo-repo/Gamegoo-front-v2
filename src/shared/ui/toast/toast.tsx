import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ToastProps, ToastType } from "../../lib/toast/types";
import { cn } from "@/shared/lib/utils";
import WaringIcon from "@/shared/assets/icons/toast/warning-ic.svg?react";
import ConfirmIcon from "@/shared/assets/icons/toast/confirm-ic.svg?react";

const renderIcon = (type: ToastType) => {
	if (type === "confirm") return <ConfirmIcon />;
	if (type === "error") return <WaringIcon />;
	return null;
};

const ANIMATION_TIME = 500;

export function Toast({
	type = "confirm",
	top = "6rem",
	bottom = "0px",
	isCloseOnClick = true,
	isAutoClosed = true,
	position = "top",
	showingTime = 3000,
	message,
	onUndo,
	onClose,
	...htmlProps
}: ToastProps) {
	const [isVisible, setIsVisible] = useState(true);

	const handleClickToClose = () => {
		if (!isCloseOnClick || !onClose) return;

		setIsVisible(false);
		setTimeout(() => {
			onClose();
		}, ANIMATION_TIME);
	};

	const handleAutoClose = () => {
		const timer = setTimeout(() => {
			setIsVisible(false);
			setTimeout(() => {
				if (onClose) onClose();
			}, ANIMATION_TIME); // fadeOut 애니메이션 시간과 동일하게 설정
		}, showingTime - ANIMATION_TIME); // 토스트가 내려가는 시간 확보

		return () => {
			clearTimeout(timer);
		};
	};

	useEffect(() => {
		if (isAutoClosed) {
			return handleAutoClose();
		}
	}, [isAutoClosed, showingTime]);

	const positionStyle = {
		[position]: position === "bottom" ? bottom : top,
	};

	return createPortal(
		<div
			{...htmlProps}
			onClick={handleClickToClose}
			className={`-translate-x-1/2 fixed left-1/2 z-50 w-full max-w-md px-4`}
			style={positionStyle}
		>
			<div
				className={cn(
					"flex items-center justify-between gap-2 rounded-xl border px-6 py-3 font-bold text-base shadow-lg transition-all duration-500",
					isVisible ? "animate-fade-in-y" : "animate-fade-out-y",
					type === "error" &&
						"border-red-600 bg-red-100 text-red-600 shadow-[3px_3px_6px_0_rgba(255,82,82,0.4)]",
					type === "confirm" &&
						"border-violet-600 bg-violet-100 text-violet-600 shadow-[3px_3px_6px_0_rgba(90,66,238,0.50)]",
				)}
			>
				{/* 왼쪽: 아이콘 + 메시지 */}
				<div className="flex flex-1 items-center gap-2">
					{renderIcon(type) && (
						<span className="text-xl">{renderIcon(type)}</span>
					)}
					<span className="whitespace-pre-line font-medium text-sm">
						{message}
					</span>
				</div>

				{/* 오른쪽: 되돌리기 버튼 */}
				{onUndo && (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation(); // 토스트 닫기 방지
							onUndo();
						}}
						className="whitespace-nowrap font-semibold text-blue-400 text-sm transition-colors hover:text-blue-300"
					>
						되돌리기
					</button>
				)}
			</div>
		</div>,
		document.body,
	);
}
