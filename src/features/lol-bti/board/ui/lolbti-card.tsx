import { cn } from "@/shared/lib/utils";
import type { ReactNode } from "react";

interface Props {
	/** 타입 뱃지, 궁합 표시 등 카드 상단 영역 */
	header: ReactNode;
	/** 프로필 이미지, 닉네임, 챔피언 통계 등 카드 중간 영역 */
	children: ReactNode;
	/** 공유하기 버튼, 친구추가/말걸기 버튼 등 카드 하단 영역 */
	footer: ReactNode;
	className?: string;
}

export default function LolBtiCard({
	header,
	children,
	footer,
	className,
}: Props) {
	return (
		<div
			className={cn(
				"flex flex-col items-center rounded-[20px] p-4 pt-6 shadow-[0px_4px_20px_0_rgba(0,0,0,0.25)]",
				className,
			)}
		>
			{header}
			{children}
			{footer}
		</div>
	);
}
