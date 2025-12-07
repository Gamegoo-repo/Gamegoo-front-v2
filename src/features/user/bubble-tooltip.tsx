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
				"-translate-x-1/2 absolute bottom-[62px] left-1/2 transition-all duration-500 ease-out",
				isVisible
					? "translate-y-0 opacity-100"
					: "pointer-events-none translate-y-[10px] opacity-0",
			)}
		>
			{/* 말풍선 본체 - 화살표 기준 왼쪽으로 오프셋 */}
			<div className="-translate-x-4 absolute bottom-[10px] left-0 whitespace-nowrap rounded-[46px] border border-violet-400 bg-gray-100 px-[13px] py-[7px]">
				<p className="font-medium text-[11px] text-gray-800">
					클릭해서 매너키워드 보기
				</p>
			</div>

			<div className="-rotate-[37deg] -translate-y-[5px] h-[10px] w-[10px] skew-y-[-15deg] border-violet-400 border-b border-l bg-gray-100" />
		</div>
	);
}
