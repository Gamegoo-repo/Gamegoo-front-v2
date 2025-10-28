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
			className="cursor-pointer transition-transform p-1"
			onClick={handleClick}
			{...props}
		>
			<RefreshIcon
				className={`${isSpinning ? "animate-spin ease-in-out" : ""}`}
			/>
		</button>
	);
}
