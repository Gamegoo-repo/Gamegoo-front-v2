import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ToastProps, ToastType } from "../../lib/toast/types";

const renderIcon = (type: ToastType) => {
	if (type === "confirm") return "✔️";
	if (type === "error") return "❌";
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
			className={`fixed left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4`}
			style={positionStyle}
		>
			<div
				className={`
          bg-gray-800 text-white px-4 py-3 rounded-2xl shadow-lg
          flex items-center justify-between gap-2
          transition-all duration-500
          ${isVisible ? "animate-fade-in-y" : "animate-fade-out-y"}
        `}
			>
				{/* 왼쪽: 아이콘 + 메시지 */}
				<div className="flex items-center gap-2 flex-1">
					{renderIcon(type) && (
						<span className="text-xl">{renderIcon(type)}</span>
					)}
					<span className="text-sm font-medium whitespace-pre-line">
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
						className="text-sm font-semibold text-blue-400 hover:text-blue-300 
                     whitespace-nowrap transition-colors"
					>
						되돌리기
					</button>
				)}
			</div>
		</div>,
		document.body,
	);
}
