import { createFileRoute, useParams } from "@tanstack/react-router";
import { formatKDAStats } from "@/entities/game/lib/kda";
import ChampionInfo from "@/entities/game/ui/champion-info";
import {
	useFetchOtherUserMannerKeywordsInfo,
	useFetchOtherUserMannerLevelInfo,
	useFetchOtherUserProfileInfo,
} from "@/entities/user/api/use-fetch-other-user-info";
import { cn } from "@/shared/lib/utils";
import MannerKeywordsCard from "@/widgets/user-info/manner-keywords-card";
import MannerLevelCard from "@/widgets/user-info/manner-level-card";
import UserProfileCard from "@/widgets/user-info/user-profile-card";

export const Route = createFileRoute("/_header-layout/users/$userId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { userId } = useParams({ from: "/_header-layout/users/$userId" });

	const { data: userProfileData } = useFetchOtherUserProfileInfo(
		Number(userId),
	);

	const { data: userMannerKeywordData } = useFetchOtherUserMannerKeywordsInfo(
		Number(userId),
	);

	const { data: userMannerLevelData } = useFetchOtherUserMannerLevelInfo(
		Number(userId),
	);

	if (!userProfileData || !userMannerKeywordData || !userMannerLevelData) {
		return;
	}

	const {
		recTotalWins = 0,
		recTotalCs,
		recTotalLosses = 0,
		recWinRate = 0,
		recAvgKDA = 0,
		recAvgKills = 0,
		recAvgDeaths = 0,
		recAvgAssists = 0,
		recAvgCsPerMinute,
	} = userProfileData.memberRecentStats || {};
	return (
		<div className="w-full h-full pt-[68px] flex flex-col gap-9 mb-48">
			<UserProfileCard data={userProfileData} />
			<div className="grid grid-cols-[1fr_auto_auto] grid-rows-2 gap-y-9 gap-x-3">
				<MannerLevelCard
					userProfileData={userProfileData}
					userMannerLevelData={userMannerLevelData}
				/>
				<MannerKeywordsCard
					title={"받은 매너 평가"}
					keywords={userMannerKeywordData.mannerKeywords.slice(0, 6)}
					type="positive"
				/>
				<MannerKeywordsCard
					title={"받은 비매너 평가"}
					keywords={userMannerKeywordData.mannerKeywords.slice(6)}
					type="negative"
				/>
				<section className="w-full">
					<h3 className="text-gray-800 regular-25 mb-2">최근 30게임</h3>

					<div className="bg-gray-100 rounded-xl flex items-center px-8 py-4 justify-between">
						<div className="flex flex-col w-fit">
							<span className="bold-20 text-gray-700">{`${recTotalWins}승 ${recTotalLosses}패`}</span>
							<span className="text-gray-500 semibold-14">{recWinRate}%</span>
						</div>

						<div className="flex flex-col w-fit">
							<p className="flex items-center gap-1">
								{formatKDAStats(recAvgKills, recAvgDeaths, recAvgAssists).map(
									(text, idx) => {
										return (
											<>
												<span
													className={cn(
														"bold-20 text-gray-700",
														idx === 1 && "text-red-500",
													)}
												>
													{text}
												</span>

												{idx !== 2 && (
													<span className="regular-20 text-gray-400">/</span>
												)}
											</>
										);
									},
								)}
							</p>
							<span className="text-gray-500 semibold-14">KDA {recAvgKDA}</span>
						</div>

						<div className="flex flex-col">
							<span className="bold-20 text-gray-700">
								평균 CS {recAvgCsPerMinute?.toFixed(1) || 0.0}
							</span>
							<span className="semibold-14 text-gray-500">
								CS {recTotalCs || 0}
							</span>
						</div>
						<div className="flex flex-col gap-2">
							<span className="regular-14 text-gray-800">최근 선호 챔피언</span>
							{userProfileData.championStatsResponseList.length ? (
								<div className="flex gap-2">
									{userProfileData.championStatsResponseList.map((champion) => {
										return (
											<ChampionInfo
												badgeClassName="text-sm min-w-[39px]"
												imageClassName="w-12 h-12"
												key={champion.championId}
												{...champion}
											/>
										);
									})}
								</div>
							) : (
								<span className="medium-14 text-gray-400">
									챔피언 정보가 없습니다
								</span>
							)}
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
