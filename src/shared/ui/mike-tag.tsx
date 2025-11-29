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
				`flex h-fit w-fit items-center justify-center gap-1 rounded-full border-2 px-2.5 py-1 font-semibold text-[13px] leading-none`,
				isMikeAvailable
					? "border-violet-600 text-violet-600"
					: "border-gray-600 text-gray-600",
				className,
			)}
		>
			<MikeIcon className="h-fit" /> 마이크 {isMikeAvailable ? "ON" : "OFF"}
		</p>
	);
}
