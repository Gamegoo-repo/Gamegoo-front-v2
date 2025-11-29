import type { ChampionStatsResponse } from "@/shared/api";
import ChampionInfo from "./champion-info";
import { cva } from "class-variance-authority";

const containerVariants = cva("flex flex-row w-full h-full", {
	variants: {
		variant: {
			board: "flex-1 gap-1.5 mobile:flex mobile:justify-center mobile:gap-2",
			modal:
				"gap-0.5 mobile:gap-2 mobile:w-full mobile:items-center mobile:justify-start",
			profile: "gap-0.5 mobile:gap-2",
		},
	},
	defaultVariants: {
		variant: "board",
	},
});

const labelVariants = cva("text-white font-bold", {
	variants: {
		variant: {
			board: "text-[11px] leading-normal",
			modal: "text-[11px] mobile:text-xs px-1.5 leading-normal",
			profile:
				"font-medium mobile:font-bold text-[11px] mobile:text-xs leading-normal",
		},
	},
	defaultVariants: {
		variant: "board",
	},
});

const iconVariants = cva("", {
	variants: {
		variant: {
			board: "w-8 h-8",
			modal: "w-8 h-8 mobile:w-12 mobile:h-12",
			profile: "w-8 h-8 mobile:w-12 mobile:h-12",
		},
	},
	defaultVariants: {
		variant: "board",
	},
});

const emptyMessageVariants = cva("text-gray-400 ", {
	variants: {
		variant: {
			board:
				"text-xs flex flex-1 mobile:w-full mobile:justify-center mobile:font-medium mobile:text-sm",
			modal: "text-sm font-medium flex h-full w-full items-center",
			profile: "",
		},
	},
	defaultVariants: {
		variant: "board",
	},
});

type ChampionStatsSectionVariant = "board" | "modal" | "profile";

interface ChampionStatsSectionProps {
	championList: ChampionStatsResponse[];
	variant?: ChampionStatsSectionVariant;
	emptyMessage?: string;
}

export default function ChampionStatsSection({
	championList,
	variant = "board",
	emptyMessage = "챔피언 정보가 없습니다",
}: ChampionStatsSectionProps) {
	const imageClassName = iconVariants({ variant });
	const badgeClassName = labelVariants({ variant });
	const containerClassName = containerVariants({ variant });
	const emptyMessageClassName = emptyMessageVariants({ variant });

	return championList.length ? (
		<ul className={containerClassName}>
			{championList.map((champion) => (
				<li
					key={champion.championId}
					className="flex items-center justify-center"
				>
					<ChampionInfo
						{...champion}
						imageClassName={imageClassName}
						badgeClassName={badgeClassName}
					/>
				</li>
			))}
		</ul>
	) : (
		<div className={emptyMessageClassName}>{emptyMessage}</div>
	);
}
