import type { OtherProfileResponse } from "@/shared/api";
import type { UserRelationshipStatus } from "@/widgets/user-info/model/user-info.types";

export function calculateRelationshipStatus(
	profile: OtherProfileResponse,
	currentUserId: number,
): UserRelationshipStatus {
	if (profile.blocked) return "blocked";
	if (profile.friend) return "friend";
	if (profile.id === currentUserId) return "me";
	if (profile.isBlind) return "deleted";
	if (profile.friendRequestMemberId === profile.id) return "pending-received";
	if (profile.friendRequestMemberId === currentUserId) return "pending-sent";

	return "stranger";
}
