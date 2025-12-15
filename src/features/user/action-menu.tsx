import type { UserRelationshipStatus } from "@/widgets/user-info/model/user-info.types";
import BlockReportMenu from "./block-menu";

export function UserActionMenu({
	userId,
	relationshipStatus,
}: {
	userId: number;
	relationshipStatus: UserRelationshipStatus;
}) {
	if (
		relationshipStatus === "me" ||
		relationshipStatus === "deleted" ||
		relationshipStatus === "guest"
	) {
		return null;
	}

	return (
		<BlockReportMenu
			userId={userId}
			relationshipStatus={relationshipStatus}
			reportType="PROFILE"
		/>
	);
}
