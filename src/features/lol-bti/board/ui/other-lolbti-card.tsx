import { LOL_BTI_TYPE_DATA } from "@/features/lol-bti/test/config";
import type { LolBtiRecommendation } from "@/shared/api";
import { cn } from "@/shared/lib/utils";
import CompatibilityHeart from "./compatibility-heart";
import LolBtiCard from "./lolbti-card";
import LolBtiChampionStats from "./lolbti-champion-stats";
import type { MyLolBtiRecommendation } from "@/shared/api/lolbti/types";
import type { ReactNode } from "react";

type CompatibilityLevel = "full" | "half" | "empty";

const getCompatibilityLevel = (score: number): CompatibilityLevel => {
	if (score >= 90) {
		return "full";
	}
	if (score >= 50) {
		return "half";
	}
	return "empty";
};

const COMPATIBILITY_LABEL: Record<CompatibilityLevel, string> = {
	full: "나와 잘 맞는 유형",
	half: "잘 맞을 수도 있고 아닐 수도 있는 유형",
	empty: "나와 잘 안 맞는 유형",
};

export default function OtherLolBtiResultCard({
	result,
	actions,
	onClick,
}: {
	result: LolBtiRecommendation | MyLolBtiRecommendation;
	actions?: ReactNode;
	onClick: () => void;
}) {
	const typeData = LOL_BTI_TYPE_DATA[result.rollBtiType];

	const compatibilityLevel =
		"compatibilityScore" in result
			? getCompatibilityLevel(result.compatibilityScore)
			: null;

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div className="w-full cursor-pointer" onClick={() => onClick()}>
			{/** TODO: 제거할 것*/}
			<LolBtiCard
				className="w-full bg-gray-100"
				header={
					<>
						<h3
							className={cn(
								"mb-4 font-medium text-gray-500 text-sm leading-none",
								!compatibilityLevel && "invisible",
							)}
						>
							{compatibilityLevel
								? COMPATIBILITY_LABEL[compatibilityLevel]
								: "\u00A0"}
						</h3>
						<p className={"mb-6 flex flex-col items-center gap-1.5"}>
							<span className="font-[900] text-[40px] text-violet-600 leading-none">
								{result.rollBtiType}
							</span>
							<span className="font-medium text-sm text-violet-600">
								{typeData.title}
							</span>
						</p>
					</>
				}
				footer={actions}
			>
				<div className="relative">
					{compatibilityLevel && (
						<div className="-translate-y-[25%] absolute top-0 right-0 translate-x-[25%]">
							<CompatibilityHeart compatibilityLevel={compatibilityLevel} />
						</div>
					)}
					<img
						className="mb-3 size-[132px] rounded-full"
						src={`/assets/images/results/${typeData.imageIndex}.png`}
						alt={`${result.rollBtiType} 결과 이미지`}
					/>
				</div>
				<span className="mb-7 inline-block text-center font-bold text-black text-xl">
					{result.gameName}
				</span>
				<LolBtiChampionStats
					className="bg-white"
					champions={result.championStatsResponseList}
				/>
			</LolBtiCard>
		</div>
	);
}
