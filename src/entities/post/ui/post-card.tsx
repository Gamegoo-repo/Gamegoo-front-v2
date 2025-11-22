import { getPositionIcon } from "@/entities/game/lib/getPositionIcon";
import { getWinRateColors } from "@/entities/game/lib/getWinRateColor";
import ChampionInfo from "@/entities/game/ui/champion-info";
import PositionCard from "@/entities/game/ui/position-card";
import TierLabel from "@/entities/game/ui/tier-label";
import UserProfile from "@/entities/user/ui/user-profile";
import type { BoardListResponse } from "@/shared/api";
import { formatDateSimple } from "@/shared/lib/format-date-simple";
import { cn } from "@/shared/lib/utils";
import { useMemo } from "react";

export default function PostCard({
	gameName,
	tag,
	mainP,
	subP,
	wantP,
	mannerLevel,
	bumpTime,
	freeTier,
	freeRank,
	soloTier,
	soloRank,
	championStatsResponseList,
	contents,
	createdAt,
	profileImage,
	winRate,
}: BoardListResponse) {
	const { text: textColor } = getWinRateColors(winRate || 0);

	const mainPositionIcon = useMemo(() => getPositionIcon(mainP), [mainP]);
	const subPositionIcon = useMemo(() => getPositionIcon(subP), [subP]);
	const searchingPosition = useMemo(
		() => wantP.map((pos) => getPositionIcon(pos)),
		[wantP],
	);
	return (
		<div className="w-full p-4 bg-gray-100 rounded-lg flex flex-col gap-4">
			<div className="flex gap-2">
				<div className="relative">
					<UserProfile id={profileImage} size={44} hasDropShadow />

					<span className="inline-block py-[1px] px-1.5 rounded-full text-violet-300 bg-black/65 absolute left-1/2 bottom-0 -translate-x-1/2 font-bold text-[9px] translate-y-2/5">
						LV.{mannerLevel}
					</span>
				</div>
				<div className="flex flex-col ">
					<p className="bold-16 text-gray-800">{gameName}</p>
					<span className="bold-12 text-gray-500">#{tag}</span>
				</div>
			</div>

			<div className="w-full flex items-center">
				<div className="flex items-center">
					<span className="text-gray-500 medium-11 leading-none text-center">
						솔로랭크
					</span>
					<TierLabel size="md" tier={soloTier} rank={soloRank} />
				</div>

				<div className="h-3 border-l border-gray-400 mx-3" />

				<div className="flex items-center">
					<span className="text-gray-500 medium-11 leading-none text-center">
						자유랭크
					</span>
					<TierLabel size="md" tier={freeTier} rank={freeRank} />
				</div>
			</div>

			<div className="w-full flex gap-2">
				<div className="flex justify-center bg-white rounded-md gap-3 px-5 pt-3 pb-2 flex-1">
					<PositionCard
						size="md"
						title="주포지션"
						positionIcons={[mainPositionIcon]}
					/>
					<PositionCard
						size="md"
						title="부포지션"
						positionIcons={[subPositionIcon]}
					/>
				</div>

				<div className="flex justify-center bg-white rounded-md gap-3 px-5 pt-3 pb-2 flex-1">
					<PositionCard
						size="md"
						title="내가 찾는 포지션"
						className=""
						positionIcons={searchingPosition}
					/>
				</div>
			</div>
			<div className="w-full flex gap-2 items-center h-fit">
				<ul className="flex-1 flex gap-1.5">
					{championStatsResponseList.length ? (
						championStatsResponseList.map((champion) => {
							return (
								<li key={champion.championName}>
									<ChampionInfo {...champion} />
								</li>
							);
						})
					) : (
						<span className="text-xs text-gray-400">
							챔피언 정보가 없습니다
						</span>
					)}
				</ul>
				<div className="flex-1 flex flex-col">
					<span className="text-gray-800 medium-11">승률</span>
					<span className={cn("bold-16", textColor)}>
						{winRate?.toFixed(1)}%
					</span>
				</div>
			</div>

			<div className="w-full">
				{/** TODO: POST-DETAIL 모달의 컴포넌트와 css가 동일함 -> 컴포넌트화하기*/}
				<div className="px-2.5 py-2 rounded-md border border-gray-400 mb-1.5 text-gray-700 text-xs ">
					<p className="line-clamp-2">{contents}</p>
				</div>
				<span className="block text-end medium-11 text-gray-500">
					{formatDateSimple(bumpTime || createdAt!)}
				</span>
			</div>
		</div>
	);
}
