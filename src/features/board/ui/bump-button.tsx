import type { ButtonHTMLAttributes } from "react";
import HoistingIcon from "@/shared/assets/icons/ic-hoisting.svg?react";
import { cn } from "@/shared/lib/utils";

interface BumpButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function BumpButton({ className, ...props }: BumpButtonProps) {
	return (
		<button
			type="button"
			className={cn(
				"h-10 cursor-pointer flex items-center gap-1 hover:-translate-y-1 transition-transform duration-200 ease-out",
				className,
			)}
			{...props}
		>
			<HoistingIcon className="text-violet-600" />
			<span className="bold-14 bg-gradient-to-r from-violet-600 to-[#E02FC8] bg-clip-text text-transparent">
				내가 쓴 글 끌어올리기
			</span>
		</button>
	);
}
