import type { ReactNode } from "react";
import type { UserRelationshipStatus } from "@/widgets/user-info/model/user-info.types";
import BlockMenu from "./block-menu";
import FriendDeleteButton from "./buttons/friend-delete-button";
import FriendRequestAcceptButton from "./buttons/friend-request-accept-button";
import FriendRequestCancelButton from "./buttons/friend-request-cancel-button";
import FriendRequestDeclineButton from "./buttons/friend-request-decline-button";
import FriendRequestSendButton from "./buttons/friend-request-send-button";

export default function UserActionMenu({
	userId,
	relationshipStatus,
}: {
	userId: number;
	relationshipStatus: UserRelationshipStatus;
}) {
	/** 이 경우 버튼/팝오버 메뉴와 같은 액션 영역 없음 */
	switch (relationshipStatus) {
		case "me":
		case "deleted":
		case "guest":
			return undefined;
	}

	let button: ReactNode | undefined;
	const menu = (
		<BlockMenu userId={userId} relationshipStatus={relationshipStatus} />
	);
	switch (relationshipStatus) {
		case "stranger":
			button = <FriendRequestSendButton userId={userId} />;
			break;
		case "friend":
			button = <FriendDeleteButton userId={userId} />;
			break;
		case "pending-sent":
			button = <FriendRequestCancelButton userId={userId} />;
			break;
		case "pending-received":
			button = (
				<div className="flex items-center gap-2">
					<FriendRequestAcceptButton userId={userId} />
					<FriendRequestDeclineButton userId={userId} />
				</div>
			);
			break;
	}

	return (
		<div className="flex items-center gap-3">
			{button}
			{menu}
		</div>
	);
}
