import type { ButtonHTMLAttributes } from "react";
import { useState } from "react";
import RefreshIcon from "@/shared/assets/icons/ic-refresh.svg?react";

interface RefreshButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function RefetchButton({
	onClick,
	...props
}: RefreshButtonProps) {
	const [isSpinning, setIsSpinning] = useState(false);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		setIsSpinning(true);
		onClick?.(e);
		setTimeout(() => setIsSpinning(false), 1000);
	};

	return (
		<button
			type="button"
			className="cursor-pointer p-1 transition-transform"
			onClick={handleClick}
			{...props}
		>
			<RefreshIcon
				className={`${isSpinning ? "animate-[spin_1s_linear_reverse]" : ""}`}
			/>
		</button>
	);
}
