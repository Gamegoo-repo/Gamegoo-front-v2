import { useRouter } from "@tanstack/react-router";
import { getPositionIcon } from "@/entities/game/lib/getPositionIcon";
import ChampionInfo from "@/entities/game/ui/champion-info";
import PositionCard from "@/entities/game/ui/position-card";
import RankInfo from "@/entities/game/ui/rank-info";
import MikeTag from "@/shared/ui/mike-tag";
import UserProfile from "@/entities/user/ui/user-profile";
import {
	BlockMenuItem,
	PopoverMenu,
	PopoverMenuItem,
} from "@/features/popover-menu";
import type { OtherProfileResponse } from "@/shared/api";
import BackIcon from "@/shared/assets/icons/ic-arrow-back.svg?react";

export default function UserProfileCard({
	data,
}: {
	data: OtherProfileResponse;
}) {
	const router = useRouter();

	const handleGoBack = () => {
		router.history.back();
	};

	const wantPositions = data.wantP.map((pos) => getPositionIcon(pos));
	const subPosition = getPositionIcon(data.subP);
	const mainPosition = getPositionIcon(data.mainP);

	return (
		<section className="w-full flex flex-col gap-5">
			<h2 className="flex items-center gap-3 font-bold text-[34px] text-gray-800">
				<button type="button" className="cursor-pointer" onClick={handleGoBack}>
					<BackIcon />
				</button>
				{data.gameName}님의 프로필
			</h2>
			<div className="w-full bg-gray-100 rounded-[30px] flex p-10 gap-[62px]">
				<UserProfile id={data.profileImg} size={186} hasDropShadow />
				<div className="flex-1 flex flex-col gap-8">
					<div className="w-full flex items-center gap-3">
						<h3 className="text-gray-800 bold-32 flex items-center gap-1.5">
							{data.gameName}
							<span className="text-gray-500 bold-20">#{data.tag}</span>
						</h3>
						<MikeTag
							className="semibold-16 pl-2 pr-2.5 py-0"
							isMikeAvailable={data.mike === "AVAILABLE"}
						/>

						<button
							type="button"
							className="px-[83px] py-3 bg-gray-800 text-white bold-14 rounded-xl ml-auto cursor-pointer"
						>
							친구 추가
						</button>
						<PopoverMenu
							menuItems={[
								<BlockMenuItem key={""} userId={data.id || 1} />,
								<BlockMenuItem key={""} userId={data.id || 1} />,
							]}
						/>
					</div>
					<div className="w-full flex gap-3">
						<RankInfo
							label="솔로랭크"
							tier={data.soloTier}
							rank={data.soloRank}
							tierClassName="bold-25"
						/>
						<RankInfo
							label="자유랭크"
							tier={data.freeTier}
							rank={data.freeRank}
							tierClassName="bold-25"
						/>
					</div>
					<div className="flex gap-3">
						<div className="bg-white rounded-[10px] px-5 pt-4 pb-3 flex gap-4 justify-center w-[200px]">
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

						<div className="bg-white rounded-[10px] px-5 pt-4 pb-3 flex gap-4 justify-center w-[200px]">
							<PositionCard
								title={"내가 찾는 포지션"}
								className="medium-16 gap-1"
								positionIcons={
									wantPositions.length
										? wantPositions
										: [getPositionIcon("ANY")]
								}
							/>
						</div>

						<div className="flex flex-col gap-1.5 ml-6">
							<span className="text-gray-600 semibold-14">
								최근 선호 챔피언
							</span>
							{data.championStatsResponseList.length ? (
								<ul className="flex gap-2">
									{data.championStatsResponseList.map((champion) => (
										<ChampionInfo
											key={champion.championId}
											{...champion}
											badgeClassName="text-sm min-w-[39px]"
											imageClassName="w-12 h-12"
										/>
									))}
								</ul>
							) : (
								<span className="medium-14 text-gray-400">
									챔피언 정보가 없습니다
								</span>
							)}
						</div>
					</div>
					<div className="w-full flex flex-col gap-2">
						<span className="text-gray-600 medium-14">게임 스타일</span>
						{data.gameStyleResponseList.length ? (
							<ul className="flex gap-2">
								{data.gameStyleResponseList.map((style) => (
									<li
										key={style.gameStyleName}
										className="bg-white text-gray-700 semibold-16 px-5 py-1.5 rounded-full"
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
		</section>
	);
}
