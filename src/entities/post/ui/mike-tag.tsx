import MikeIcon from "@/shared/assets/icons/ic-mike.svg?react";
import { cn } from "@/shared/lib/utils";

export default function MikeTag({
	isMikeAvailable,
	className,
}: {
	isMikeAvailable: boolean;
	className?: string;
}) {
	return (
		<p
			className={cn(
				`flex w-fit h-fit items-center justify-center gap-1 rounded-full px-3 py-0.5 border-2 text-[13px] font-semibold`,
				isMikeAvailable
					? "border-violet-600 text-violet-600"
					: "border-gray-600 text-gray-600",
				className && className,
			)}
		>
			<MikeIcon className="h-fit" /> 마이크 {isMikeAvailable ? "ON" : "OFF"}
		</p>
	);
}
