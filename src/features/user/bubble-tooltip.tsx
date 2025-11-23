import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";

export default function BubbleTooltip() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const showTimer = setTimeout(() => {
			setIsVisible(true);

			const hideTimer = setTimeout(() => {
				setIsVisible(false);
			}, 4000);

			return () => clearTimeout(hideTimer);
		}, 200);

		return () => clearTimeout(showTimer);
	}, []);

	return (
		<div
			className={cn(
				"absolute bottom-[62px] left-1/2 -translate-x-1/2 transition-all duration-500 ease-out",
				isVisible
					? "opacity-100 translate-y-0"
					: "opacity-0 translate-y-[10px] pointer-events-none",
			)}
		>
			{/* 말풍선 본체 - 화살표 기준 왼쪽으로 오프셋 */}
			<div className="absolute bottom-[10px] left-0 -translate-x-4 border border-violet-400 px-[13px] py-[7px] bg-gray-100 rounded-[46px] whitespace-nowrap">
				<p className="text-gray-800 text-[11px] font-medium">
					클릭해서 매너키워드 보기
				</p>
			</div>

			<div className="w-[10px] h-[10px]  border-l border-b border-violet-400 bg-gray-100 -rotate-[37deg] -translate-y-[5px] skew-y-[-15deg]" />
		</div>
	);
}
