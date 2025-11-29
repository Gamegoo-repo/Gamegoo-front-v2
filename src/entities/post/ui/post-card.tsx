import { useMemo } from "react";
import { getPositionIcon } from "@/entities/game/lib/getPositionIcon";
import { getWinRateColors } from "@/entities/game/lib/getWinRateColor";
import ChampionInfo from "@/entities/game/ui/champion-info";
import PositionCard from "@/entities/game/ui/position-card";
import TierLabel from "@/entities/game/ui/tier-label";
import UserProfile from "@/entities/user/ui/user-profile";
import type { BoardListResponse } from "@/shared/api";
import { formatDateSimple } from "@/shared/lib/format-date-simple";
import { cn } from "@/shared/lib/utils";

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
		<div className="flex w-full flex-col gap-4 rounded-lg bg-gray-100 p-4">
			<div className="flex gap-2">
				<div className="relative">
					<UserProfile id={profileImage} size={44} hasDropShadow />

					<span className="-translate-x-1/2 absolute bottom-0 left-1/2 inline-block translate-y-2/5 rounded-full bg-black/65 px-1.5 py-[1px] font-bold text-[9px] text-violet-300">
						LV.{mannerLevel}
					</span>
				</div>
				<div className="flex flex-col">
					<p className="bold-16 text-gray-800">{gameName}</p>
					<span className="bold-12 text-gray-500">#{tag}</span>
				</div>
			</div>

			<div className="flex w-full items-center">
				<div className="flex items-center">
					<span className="medium-11 text-center text-gray-500 leading-none">
						솔로랭크
					</span>
					<TierLabel size="md" tier={soloTier} rank={soloRank} />
				</div>

				<div className="mx-3 h-3 border-gray-400 border-l" />

				<div className="flex items-center">
					<span className="medium-11 text-center text-gray-500 leading-none">
						자유랭크
					</span>
					<TierLabel size="md" tier={freeTier} rank={freeRank} />
				</div>
			</div>

			<div className="flex w-full gap-2">
				<div className="flex flex-1 justify-center gap-3 rounded-md bg-white px-5 pt-3 pb-2">
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

				<div className="flex flex-1 justify-center gap-3 rounded-md bg-white px-5 pt-3 pb-2">
					<PositionCard
						size="md"
						title="내가 찾는 포지션"
						className=""
						positionIcons={searchingPosition}
					/>
				</div>
			</div>
			<div className="flex h-fit w-full items-center gap-2">
				<ul className="flex flex-1 gap-1.5">
					{championStatsResponseList.length ? (
						championStatsResponseList.map((champion) => {
							return (
								<li key={champion.championName}>
									<ChampionInfo {...champion} />
								</li>
							);
						})
					) : (
						<span className="text-gray-400 text-xs">
							챔피언 정보가 없습니다
						</span>
					)}
				</ul>
				<div className="flex flex-1 flex-col">
					<span className="medium-11 text-gray-800">승률</span>
					<span className={cn("bold-16", textColor)}>
						{winRate?.toFixed(1)}%
					</span>
				</div>
			</div>

			<div className="w-full">
				{/** TODO: POST-DETAIL 모달의 컴포넌트와 css가 동일함 -> 컴포넌트화하기*/}
				<div className="mb-1.5 rounded-md border border-gray-400 px-2.5 py-2 text-gray-700 text-xs">
					<p className="line-clamp-2">{contents}</p>
				</div>
				<span className="medium-11 block text-end text-gray-500">
					{formatDateSimple(bumpTime || createdAt!)}
				</span>
			</div>
		</div>
	);
}
