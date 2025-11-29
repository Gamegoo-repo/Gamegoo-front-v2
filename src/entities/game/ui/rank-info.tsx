// components/ui/rank-info.tsx
import type { Tier } from "@/shared/api";
import { capitalize } from "@/shared/lib/capitalize";
import { cn } from "@/shared/lib/utils";
import { getTierIcon } from "../lib/getTierIcon";
import { cva, type VariantProps } from "class-variance-authority";

/**
 *  - 카드 : 모바일 무한 스크롤에서 사용되는 형태 (확인 완료)
 *  - 모달 : 게시글 상세 정보 모달에서 사용되는 형태 (확인 완료)
 *  - 프로필: 프로필 페이지에서 사용되는 형태 ()
 */

const rankInfoVariants = cva("flex", {
	variants: {
		variant: {
			card: "flex-row gap-1 items-center",
			modal: "flex-col",
			profile: "flex-col gap-0 mobile:gap-0.5 mobile:w-[180px]",
		},
	},
	defaultVariants: {
		variant: "card",
	},
});

const labelVariants = cva("text-gray-600", {
	variants: {
		variant: {
			card: "font-medium text-[11px]",
			modal:
				"text-[11px] font-medium mobile:font-semibold mobile:text-sm text-gray-800",
			profile: "font-medium text-[11px] mobile:text-sm",
		},
	},
	defaultVariants: {
		variant: "card",
	},
});

const tierContainerVariants = cva("flex items-center text-gray-800", {
	variants: {
		variant: {
			card: "gap-1",
			modal: "gap-1",
			profile: "gap-0 mobile:gap-0.5",
		},
	},
	defaultVariants: {
		variant: "card",
	},
});

const iconVariants = cva("", {
	variants: {
		variant: {
			card: "w-6 h-6",
			modal: "w-8 h-8",
			profile: "w-8 h-8",
		},
	},
	defaultVariants: {
		variant: "card",
	},
});

const tierTextVariants = cva("font-bold text-gray-800", {
	variants: {
		variant: {
			card: "text-xs",
			modal: "text-sm mobile:text-xl",
			profile: "text-sm mobile:text-[25px]",
		},
	},
	defaultVariants: {
		variant: "card",
	},
});

interface RankInfoProps extends VariantProps<typeof rankInfoVariants> {
	tier: Tier;
	rank: number;
	label?: string;
	className?: string;
	tierClassName?: string;
}

export default function RankInfo({
	tier,
	rank,
	label,
	variant,
	className,
	tierClassName,
}: RankInfoProps) {
	const TierIcon = getTierIcon(tier);

	return (
		<div className={cn(rankInfoVariants({ variant }), className)}>
			{label && <span className={labelVariants({ variant })}>{label}</span>}

			{/* 티어 정보 */}
			<div className={cn(tierContainerVariants({ variant }), tierClassName)}>
				<TierIcon className={iconVariants({ variant })} />
				<span className={tierTextVariants({ variant })}>
					{capitalize(tier)} {tier !== "UNRANKED" && rank}
				</span>
			</div>
		</div>
	);
}
