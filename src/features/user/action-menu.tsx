import type { UserRelationshipStatus } from "@/widgets/user-info/model/user-info.types";
import BlockMenu from "./block-menu";

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

	return <BlockMenu userId={userId} relationshipStatus={relationshipStatus} />;
}
