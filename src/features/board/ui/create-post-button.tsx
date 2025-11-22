import { type ComponentPropsWithoutRef } from "react";

export default function CreatePostButton({
	className,
	...props
}: ComponentPropsWithoutRef<"button">) {
	return (
		<button
			type="button"
			{...props}
			className={`whitespace-nowrap w-[104px] mobile:w-[248px] h-full px-5 py-2 mobile:px-14 mobile:py-5 text-white semibold-14 mobile:bold-14 bg-violet-600 rounded-[6px] mobile:rounded-xl cursor-pointer hover:bg-violet-700 active:scale-95 transition-all duration-200 ${className || ""}`}
		>
			글 작성하기
		</button>
	);
}
