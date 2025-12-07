import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/lib/utils";

export default function CreatePostButton({
	className,
	...props
}: ComponentPropsWithoutRef<"button">) {
	return (
		<button
			type="button"
			{...props}
			className={cn(
				"semibold-14 mobile:bold-14 h-full mobile:w-[248px] w-[104px] cursor-pointer whitespace-nowrap mobile:rounded-xl rounded-[6px] bg-violet-600 mobile:px-14 px-5 mobile:py-5 py-2 text-white transition-all duration-200 hover:bg-violet-700 active:scale-95",
				className,
			)}
		>
			글 작성하기
		</button>
	);
}
