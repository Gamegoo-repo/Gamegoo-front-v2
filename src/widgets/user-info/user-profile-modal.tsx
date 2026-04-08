import { Modal } from "@gamegoo-ui/design-system";
import UserProfileCard from "./user-profile-card";
import UserActionButtons from "@/features/user/buttons/user-action-buttons";
import { UserActionMenu } from "@/features/user/action-menu";
import { useUserProfileData } from "@/features/user/hooks/use-user-profile-data";
import UserInfoWidget from "./user-info-widget";
import {
	MOCK_MANNER_KEYWORDS,
	MOCK_MANNER_LEVEL,
	MOCK_USER_PROFILE,
} from "@/entities/user/config/user-mock-data";
import UserInfoSkeleton from "./user-info-skeleton";
import DeletedUserView from "./deleted-user-view";
import UserProfileHeader from "@/features/profile/user-profile-header";
import MannerLevelCard from "./manner-level-card";
import MannerKeywordsCard from "./manner-keywords-card";
import RecentStatsCard from "@/features/user/recent-stats-card";

interface UserProfileModalProps {
	memberId: number;
	isOpen: boolean;
	onClose: () => void;
}

export default function UserProfileModal({
	memberId,
	isOpen,
	onClose,
}: UserProfileModalProps) {
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
			!data?.profile ||
			!data?.mannerLevel ||
			!data?.mannerKeywords ||
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
			<UserProfileCard
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
		);
	};

	return (
		/** TODO: 디자인 시스템에 추가하기 */
		<Modal
			className="overflow-hidden! h-[90%]! p-0! xl:max-w-[1300px]"
			isOpen={isOpen}
			onClose={onClose}
		>
			<section className="flex h-full w-full flex-col gap-9 overflow-y-auto p-8">
				{data.profile && relationshipStatus && (
					<UserProfileHeader
						relationshipStatus={relationshipStatus}
						showBackButton={false}
					>
						{relationshipStatus === "me"
							? "나의 프로필"
							: `${data.profile.gameName}님의 프로필`}
					</UserProfileHeader>
				)}
				{renderContent()}
				{data.profile &&
					data.mannerLevel &&
					data.mannerKeywords &&
					recentStats && (
						<div className="grid w-full grid-cols-1 mobile:grid-cols-2 tablet:grid-cols-[1fr_auto_auto] grid-rows-[auto_auto_auto] tablet:grid-rows-[minmax(264px,auto)_auto] mobile:gap-x-5 tablet:gap-x-3 gap-y-9 pb-20">
							<div className="col-span-1 mobile:col-span-2 tablet:col-span-1">
								<MannerLevelCard
									userProfile={{ gameName: data.profile.gameName }}
									userMannerLevelData={data.mannerLevel}
								/>
							</div>
							<div className="mobile:col-span-1">
								<MannerKeywordsCard
									title={"받은 매너 평가"}
									keywords={data.mannerKeywords.mannerKeywords.slice(0, 6)}
									type="positive"
								/>
							</div>
							<div className="mobile:col-span-1">
								<MannerKeywordsCard
									title={"받은 비매너 평가"}
									keywords={data.mannerKeywords.mannerKeywords.slice(6)}
									type="negative"
								/>
							</div>
							<div className="mobile:col-span-2 tablet:col-span-1 w-full">
								<RecentStatsCard
									recentStats={recentStats}
									championList={data.profile.championStatsResponseList}
								/>
							</div>
						</div>
					)}
			</section>
		</Modal>
	);
}
