import type { ReactNode } from "react";
import { getPositionIcon } from "@/entities/game/lib/getPositionIcon";
import PositionCard from "@/entities/game/ui/position-card";
import RankInfo from "@/entities/game/ui/rank-info";
import UserProfile from "@/entities/user/ui/user-profile";
import type { OtherProfileResponse } from "@/shared/api";
import MikeTag from "@/shared/ui/mike-tag";
import ChampionStatsSection from "@/entities/game/ui/champion-stats-section";

export default function UserProfileCardMobile({
	data,
	button,
	menu,
}: {
	data: OtherProfileResponse;
	button?: ReactNode;
	menu?: ReactNode;
}) {
	const wantPositions = data.wantP.map((pos) => getPositionIcon(pos));
	const subPosition = getPositionIcon(data.subP);
	const mainPosition = getPositionIcon(data.mainP);

	return (
		<div className="flex w-full flex-col gap-5 rounded-lg bg-gray-100 p-5">
			<div className="flex w-full items-center gap-2">
				<UserProfile id={data.profileImg} sizeClass="w-13 h-13" hasDropShadow />
				<p className="flex flex-col">
					<div className="flex items-center gap-1">
						<h3 className="font-bold text-base text-gray-800">
							{data.gameName}
						</h3>
						<MikeTag
							className="px-1.5 py-0 font-bold text-[9px]"
							isMikeAvailable={data.mike === "AVAILABLE"}
						/>
					</div>
					<span className="font-semibold text-gray-500 text-xs">
						#{data.tag}
					</span>
				</p>
				<div className="flex flex-1 justify-end">{menu}</div>
			</div>
			<div className="grid w-full grid-cols-[1fr_1fr] gap-2">
				<RankInfo
					label="솔로랭크"
					tier={data.soloTier}
					rank={data.soloRank}
					variant={"profile"}
				/>
				<RankInfo
					label="자유랭크"
					tier={data.freeTier}
					rank={data.freeRank}
					variant={"profile"}
				/>
			</div>
			<div className="grid w-full grid-cols-[1fr_1fr] gap-2">
				<div className="flex w-full justify-center gap-4 rounded-[6px] bg-white px-5 pt-3 pb-2">
					<PositionCard
						size="md"
						className="medium-11"
						title={"주포지션"}
						positionIcons={[mainPosition]}
					/>
					<PositionCard
						size="md"
						className="medium-11"
						title={"부포지션"}
						positionIcons={[subPosition]}
					/>
				</div>

				<div className="flex w-full justify-center gap-4 rounded-[6px] bg-white px-5 pt-3 pb-2">
					<PositionCard
						size="md"
						title={"내가 찾는 포지션"}
						className="medium-11"
						positionIcons={
							wantPositions.length ? wantPositions : [getPositionIcon("ANY")]
						}
					/>
				</div>
			</div>
			<div className="flex w-full flex-col gap-2">
				<span className="medium-11 text-gray-600">게임 스타일</span>
				{data.gameStyleResponseList.length ? (
					<ul className="flex w-full flex-wrap gap-1">
						{data.gameStyleResponseList.map((style) => (
							<li
								key={style.gameStyleName}
								className="semibold-13 inline-block whitespace-nowrap rounded-full bg-white px-4 py-1 text-gray-700 leading-none"
							>
								{style.gameStyleName}
							</li>
						))}
					</ul>
				) : (
					<span className="medium-14 text-gray-400">
						선택한 게임 스타일이 없어요
					</span>
				)}
			</div>

			<div className="flex flex-col gap-1.5">
				<span className="semibold-14 text-gray-600">최근 선호 챔피언</span>
				<ChampionStatsSection
					championList={data.championStatsResponseList}
					variant="profile"
				/>
			</div>
			<div className="mt-1 w-full">{button}</div>
		</div>
	);
}
