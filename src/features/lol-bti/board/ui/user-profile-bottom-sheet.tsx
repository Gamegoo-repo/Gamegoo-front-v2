import {
	MOCK_MANNER_KEYWORDS,
	MOCK_MANNER_LEVEL,
	MOCK_USER_PROFILE,
} from "@/entities/user/config/user-mock-data";
import { UserActionMenu } from "@/features/user/action-menu";
import UserActionButtons from "@/features/user/buttons/user-action-buttons";
import { useUserProfileData } from "@/features/user/hooks/use-user-profile-data";
import RecentStatsCard from "@/features/user/recent-stats-card";
import { BottomSheet } from "@/shared/ui/bottom-sheet";
import DeletedUserView from "@/widgets/user-info/deleted-user-view";
import MannerKeywordsCard from "@/widgets/user-info/manner-keywords-card";
import MannerLevelCard from "@/widgets/user-info/manner-level-card";
import UserInfoSkeleton from "@/widgets/user-info/user-info-skeleton";
import UserInfoWidget from "@/widgets/user-info/user-info-widget";
import UserProfileCardMobile from "@/widgets/user-info/user-profile-card-mobile";
import { FlexBox } from "@gamegoo-ui/design-system";

export default function UserProfileBottomSheet({
	memberId,
	onClose,
}: {
	memberId: number;
	onClose: () => void;
}) {
	const { data, isPending, isError, relationshipStatus, recentStats } =
		useUserProfileData(memberId);

	const renderContent = () => {
		if (relationshipStatus === "guest") {
			return (
				<UserInfoWidget
					userMannerKeywordData={MOCK_MANNER_KEYWORDS}
					userMannerLevelData={MOCK_MANNER_LEVEL}
					userProfileData={MOCK_USER_PROFILE}
					relationshipStatus="guest"
				/>
			);
		}
		if (isPending || relationshipStatus === null) {
			return <UserInfoSkeleton />;
		}
		if (
			isError ||
			!data.profile ||
			!data.mannerLevel ||
			!data.mannerKeywords ||
			!recentStats
		) {
			return (
				<div className="flex h-full w-full items-center justify-center pt-[68px]">
					<div className="text-center">
						<h2 className="mb-2 font-bold text-2xl text-gray-800">
							사용자를 찾을 수 없습니다
						</h2>
						<p className="text-gray-600">존재하지 않는 사용자입니다.</p>
					</div>
				</div>
			);
		}
		if (data.profile.isBlind) {
			return <DeletedUserView />;
		}

		return (
			<FlexBox direction="column" className="h-full w-full" gap={24}>
				{data.profile && (
					<UserProfileCardMobile
						data={data.profile}
						button={
							<UserActionButtons
								userId={data.profile.id}
								relationshipStatus={relationshipStatus}
							/>
						}
						menu={
							<UserActionMenu
								userId={data.profile.id}
								relationshipStatus={relationshipStatus}
							/>
						}
					/>
				)}
				<div className="grid w-full grid-cols-1 mobile:grid-cols-[1fr_auto_auto] grid-rows-[auto_auto_auto] mobile:grid-rows-[minmax(264px,auto)_auto] mobile:gap-x-3 gap-y-9 pb-20">
					<MannerLevelCard
						userProfile={{ gameName: data.profile.gameName }}
						userMannerLevelData={data.mannerLevel}
					/>
					<MannerKeywordsCard
						title={"받은 매너 평가"}
						keywords={data.mannerKeywords.mannerKeywords.slice(0, 6)}
						type="positive"
					/>
					<MannerKeywordsCard
						title={"받은 비매너 평가"}
						keywords={data.mannerKeywords.mannerKeywords.slice(6)}
						type="negative"
					/>
					<RecentStatsCard
						recentStats={recentStats}
						championList={data.profile.championStatsResponseList}
					/>
				</div>
			</FlexBox>
		);
	};

	return (
		<BottomSheet
			title={data.profile ? `${data.profile.gameName}님의 프로필` : undefined}
			isOpen={!!memberId}
			onClose={onClose}
		>
			{() => renderContent()}
		</BottomSheet>
	);
}
