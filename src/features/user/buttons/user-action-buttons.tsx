import type { UserRelationshipStatus } from "@/widgets/user-info/model/user-info.types";
import FriendRequestSendButton from "./friend-request-send-button";
import FriendDeleteButton from "./friend-delete-button";
import FriendRequestCancelButton from "./friend-request-cancel-button";
import FriendRequestAcceptButton from "./friend-request-accept-button";
import FriendRequestDeclineButton from "./friend-request-decline-button";

export default function UserActionButtons({
	userId,
	relationshipStatus,
}: {
	userId: number;
	relationshipStatus: UserRelationshipStatus;
}) {
	switch (relationshipStatus) {
		case "me":
		case "deleted":
		case "guest":
			return undefined;
	}

	switch (relationshipStatus) {
		case "stranger":
			return <FriendRequestSendButton userId={userId} />;
		case "friend":
			return <FriendDeleteButton userId={userId} />;
		case "pending-sent":
			return <FriendRequestCancelButton userId={userId} />;
		case "pending-received":
			return (
				<div className="flex items-center gap-2">
					<FriendRequestAcceptButton userId={userId} />
					<FriendRequestDeclineButton userId={userId} />
				</div>
			);
		default:
			return null;
	}
}
