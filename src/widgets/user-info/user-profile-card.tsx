import type { ReactNode } from "react";
import { getPositionIcon } from "@/entities/game/lib/getPositionIcon";
import PositionCard from "@/entities/game/ui/position-card";
import RankInfo from "@/entities/game/ui/rank-info";
import UserProfile from "@/entities/user/ui/user-profile";
import type { OtherProfileResponse } from "@/shared/api";
import MikeTag from "@/shared/ui/mike-tag";
import ChampionStatsSection from "@/entities/game/ui/champion-stats-section";

export default function UserProfileCard({
	data,
	menu,
	button,
}: {
	data: OtherProfileResponse;
	menu?: ReactNode;
	button?: ReactNode;
}) {
	const wantPositions = data.wantP.map((pos) => getPositionIcon(pos));
	const subPosition = getPositionIcon(data.subP);
	const mainPosition = getPositionIcon(data.mainP);

	return (
		<div className="flex w-full gap-[62px] rounded-[30px] bg-gray-100 p-10">
			<UserProfile
				id={data.profileImg}
				sizeClass="w-[186px] h-[186px]"
				hasDropShadow
			/>
			<div className="flex flex-1 flex-col gap-8">
				<div className="flex w-full items-center gap-3">
					<h3 className="bold-32 flex items-center gap-1.5 text-gray-800">
						{data.gameName}
						<span className="bold-20 text-gray-500">#{data.tag}</span>
					</h3>
					<MikeTag
						className="semibold-16 py-0 pr-2.5 pl-2"
						isMikeAvailable={data.mike === "AVAILABLE"}
					/>

					<div className="ml-auto">
						<div className="flex items-center gap-3">
							{button}
							{menu}
						</div>
					</div>
				</div>
				<div className="flex w-full gap-2 mobile:gap-3">
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
				<div className="flex gap-3">
					<div className="flex w-[200px] justify-center gap-4 rounded-[10px] bg-white px-5 pt-4 pb-3">
						<PositionCard
							className="medium-16 gap-1"
							title={"주포지션"}
							positionIcons={[mainPosition]}
						/>
						<PositionCard
							className="medium-16 gap-1"
							title={"부포지션"}
							positionIcons={[subPosition]}
						/>
					</div>

					<div className="flex w-[200px] justify-center gap-4 rounded-[10px] bg-white px-5 pt-4 pb-3">
						<PositionCard
							title={"내가 찾는 포지션"}
							className="medium-16 gap-1"
							positionIcons={
								wantPositions.length ? wantPositions : [getPositionIcon("ANY")]
							}
						/>
					</div>

					<div className="ml-6 flex flex-col gap-1.5">
						<span className="semibold-14 text-gray-600">최근 선호 챔피언</span>

						<ChampionStatsSection
							championList={data.championStatsResponseList}
							variant="profile"
						/>
					</div>
				</div>
				<div className="flex w-full flex-col gap-2">
					<span className="medium-14 text-gray-600">게임 스타일</span>
					{data.gameStyleResponseList.length ? (
						<ul className="flex gap-2">
							{data.gameStyleResponseList.map((style) => (
								<li
									key={style.gameStyleName}
									className="semibold-16 rounded-full bg-white px-5 py-1.5 text-gray-700"
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
			</div>
		</div>
	);
}
