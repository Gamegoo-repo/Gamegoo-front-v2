import { createFileRoute, useParams } from "@tanstack/react-router";
import { useFetchOtherUserInfo } from "@/entities/user/api/use-fetch-other-user-info";
import {
	MOCK_MANNER_KEYWORDS,
	MOCK_MANNER_LEVEL,
	MOCK_USER_PROFILE,
} from "@/entities/user/config/user-mock-data";
import { useAuth } from "@/shared/model/use-auth";
import DeletedUserView from "@/widgets/user-info/deleted-user-view";
import type { UserRelationshipStatus } from "@/widgets/user-info/model/user-info.types";
import UserInfoSkeleton from "@/widgets/user-info/user-info-skeleton";
import UserInfoWidget from "@/widgets/user-info/user-info-widget";

export const Route = createFileRoute("/_header-layout/users/$userId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { userId } = useParams({ from: "/_header-layout/users/$userId" });
	const { isAuthenticated, user } = useAuth();

	// 로그인 한 유저만 타유저 정보 패칭
	const { data, isPending, isError } = useFetchOtherUserInfo(Number(userId), {
		enabled: isAuthenticated,
	});

	function getRelationshipStatus(
		userId: number,
		isAuthenticated: boolean,
		profile: {
			blocked: boolean;
			friend: boolean;
			id: number;
			friendRequestMemberId?: number;
			isBlind: boolean;
		},
	): UserRelationshipStatus {
		if (!isAuthenticated) return "guest";
		if (profile.blocked) return "blocked";
		if (profile.friend) return "friend";
		if (userId === user?.id) return "me";
		if (profile.isBlind) return "deleted";
		if (profile.friendRequestMemberId === profile.id) return "pending-received";
		if (profile.friendRequestMemberId === user?.id) return "pending-sent";
		return "stranger";
	}

	// 로그인 안 한 경우 바로 렌더링
	if (!isAuthenticated) {
		return (
			<UserInfoWidget
				userMannerKeywordData={MOCK_MANNER_KEYWORDS}
				userMannerLevelData={MOCK_MANNER_LEVEL}
				userProfileData={MOCK_USER_PROFILE}
				relationshipStatus={"guest"}
			/>
		);
	}

	// 로그인을 했고 데이터 패칭 중인 경우
	if (isPending) {
		return <UserInfoSkeleton />;
	}

	// 로그인 사용자 에러
	if (isError || !data.profile || !data.mannerLevel || !data.mannerKeywords) {
		return (
			<div className="w-full h-full pt-[68px] flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-800 mb-2">
						사용자를 찾을 수 없습니다
					</h2>
					<p className="text-gray-600">존재하지 않는 사용자입니다.</p>
				</div>
			</div>
		);
	}

	// 차단한 사용자
	if (data.profile.isBlind) {
		return <DeletedUserView />;
	}

	const relationshipStatus: UserRelationshipStatus = getRelationshipStatus(
		Number(userId),
		isAuthenticated,
		data.profile,
	);

	console.log(data);

	return (
		<UserInfoWidget
			userMannerKeywordData={data.mannerKeywords}
			userMannerLevelData={data.mannerLevel}
			userProfileData={data.profile}
			relationshipStatus={relationshipStatus}
		/>
	);
}
