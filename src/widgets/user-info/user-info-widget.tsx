import { formatKDA, formatKDAStats } from "@/entities/game/lib/kda";
import UserProfileHeader from "@/features/profile/user-profile-header";
import type {
	MannerKeywordListResponse,
	MannerResponse,
	OtherProfileResponse,
} from "@/shared/api";
import { cn } from "@/shared/lib/utils";
import MannerKeywordsCard from "./manner-keywords-card";
import MannerLevelCard from "./manner-level-card";
import type { UserRelationshipStatus } from "./model/user-info.types";
import UserProfileCard from "./user-profile-card";
import { useResponsive } from "@/shared/model/responsive-context";
import UserProfileCardMobile from "./user-profile-card-mobile";
import ChampionStatsSection from "@/entities/game/ui/champion-stats-section";
import UserActionButtons from "@/features/user/buttons/user-action-buttons";
import { UserActionMenu } from "@/features/user/action-menu";

interface UserInfoWidgetProps {
	relationshipStatus: UserRelationshipStatus;
	userProfileData: OtherProfileResponse;
	userMannerKeywordData: MannerKeywordListResponse;
	userMannerLevelData: MannerResponse;
}

export default function UserInfoWidget({
	relationshipStatus,
	userProfileData,
	userMannerKeywordData,
	userMannerLevelData,
}: UserInfoWidgetProps) {
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

	const { isMobile } = useResponsive();

	return (
		<div className="mb-48 flex h-full w-full flex-col gap-9 mobile:px-0 px-5 mobile:pt-[68px]">
			<section className="flex w-full flex-col mobile:gap-5">
				<UserProfileHeader relationshipStatus={relationshipStatus}>
					{relationshipStatus === "me"
						? "나의 프로필"
						: `${userProfileData.gameName}님의 프로필`}
				</UserProfileHeader>
				{isMobile && (
					<UserProfileCardMobile
						data={userProfileData}
						button={
							<UserActionButtons
								userId={userProfileData.id}
								relationshipStatus={relationshipStatus}
							/>
						}
						menu={
							<UserActionMenu
								userId={userProfileData.id}
								relationshipStatus={relationshipStatus}
							/>
						}
					/>
				)}
				{!isMobile && (
					<UserProfileCard
						data={userProfileData}
						button={
							<UserActionButtons
								userId={userProfileData.id}
								relationshipStatus={relationshipStatus}
							/>
						}
						menu={
							<UserActionMenu
								userId={userProfileData.id}
								relationshipStatus={relationshipStatus}
							/>
						}
					/>
				)}
			</section>
			<div className="grid grid-cols-1 mobile:grid-cols-[1fr_auto_auto] grid-rows-[auto_auto_auto] mobile:grid-rows-[minmax(264px,auto)_auto] mobile:gap-x-3 gap-y-9">
				<MannerLevelCard
					userProfile={{ gameName: userProfileData.gameName }}
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
					<h3 className="mb-2 font-semibold mobile:font-normal mobile:text-2xl text-gray-800 text-lg">
						최근 30게임
					</h3>

					<div className="flex mobile:flex-row flex-col mobile:items-center mobile:justify-between gap-3 mobile:rounded-lg rounded-xl bg-gray-100 mobile:px-8 px-5 py-4">
						<div className="flex w-fit mobile:flex-col items-center gap-2">
							<span className="font-bold mobile:text-xl text-base text-gray-700">{`${recTotalWins}승 ${recTotalLosses}패`}</span>
							<span className="font-semibold mobile:text-sm text-gray-500 text-xs">
								{recWinRate}%
							</span>
						</div>

						<div className="flex w-fit mobile:flex-col items-center gap-2">
							<p className="flex items-center gap-1">
								{formatKDAStats(recAvgKills, recAvgDeaths, recAvgAssists).map(
									(text, idx) => {
										return (
											<>
												<span
													className={cn(
														"font-bold mobile:text-xl text-base text-gray-700",
														idx === 1 && "text-red-500",
													)}
												>
													{text}
												</span>

												{idx !== 2 && (
													<span className="mobile:text-xl text-base text-gray-400">
														/
													</span>
												)}
											</>
										);
									},
								)}
							</p>
							<span className="font-semibold mobile:text-sm text-gray-500 text-xs">
								KDA {formatKDA(recAvgKDA)}
							</span>
						</div>

						<div className="flex mobile:flex-col items-center gap-2">
							<span className="font-bold mobile:text-xl text-base text-gray-700">
								평균 CS {(recAvgCsPerMinute || 0).toFixed(1)}
							</span>
							<span className="font-semibold mobile:text-sm text-gray-500 text-xs">
								CS {recTotalCs || 0}
							</span>
						</div>
						<div className="flex flex-col gap-1 mobile:gap-2">
							<span className="font-medium mobile:text-sm text-[11px] text-gray-800">
								최근 선호 챔피언
							</span>

							<ChampionStatsSection
								championList={userProfileData.championStatsResponseList}
								variant="profile"
							/>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
