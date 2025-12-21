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
				"flex h-fit w-fit items-center justify-center gap-1 rounded-full border-2 mobile:px-2.5 px-1.5 mobile:py-1 py-[1px] font-semibold mobile:text-[13px] text-[9px] leading-none",
				isMikeAvailable
					? "border-violet-600 text-violet-600"
					: "border-gray-600 text-gray-600",
				className,
			)}
		>
			<MikeIcon className="h-2.5 mobile:h-fit" /> 마이크
			{isMikeAvailable ? "ON" : "OFF"}
		</p>
	);
}
