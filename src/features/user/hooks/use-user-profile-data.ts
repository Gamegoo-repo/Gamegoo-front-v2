import { useFetchOtherUserInfo } from "@/entities/user/api/use-fetch-other-user-info";
import { useAuth } from "@/shared/model/use-auth";
import type { UserRelationshipStatus } from "@/widgets/user-info/model/user-info.types";
import { useMemo } from "react";
import { calculateRelationshipStatus } from "../lib/calculate-relationship-status";

export function useUserProfileData(memberId: number) {
	const { isAuthenticated, user } = useAuth();

	const { data, isPending, isError } = useFetchOtherUserInfo(memberId, {
		enabled: isAuthenticated,
	});

	const relationshipStatus = useMemo<UserRelationshipStatus | null>(() => {
		if (!isAuthenticated || !user?.id) return "guest"; // 로그인하지 않은 유저
		if (!data?.profile) return null; // 데이터 패칭 중인 경우
		return calculateRelationshipStatus(data.profile, user.id); // 이 외의 경우
	}, [isAuthenticated, user?.id, data?.profile]);

	/**  TODO: 최근 전적이 없는 경우를 어떻게 처리하는지 확인하고, return null을 해도 되는지 파악 */
	const recentStats = data?.profile?.memberRecentStats ?? null;

	return {
		// isAuthenticated,
		data,
		isPending,
		isError,
		relationshipStatus,
		recentStats,
	};
}
