import type { MyLolBtiRecommendation } from "@/shared/api/lolbti/types";
import { useSendFriendRequest } from "@/features/user/hooks/use-send-friend-request";
import { Button } from "@gamegoo-ui/design-system";
import OpenChatRoomButton from "./open-chat-room-button";
import type { ReactNode } from "react";

interface UserRelationActionsProps {
	result: MyLolBtiRecommendation;
}

export default function UserRelationActions({
	result,
}: UserRelationActionsProps) {
	const { mutate: sendFriendRequest, isPending } = useSendFriendRequest(
		result.memberId,
	);

	let leftButton: ReactNode | undefined;

	/** 내가 보낸 친구 요청 대기 중 */
	if (result.friendRequestSent) {
		leftButton = (
			<Button size="lg" style={{ flex: 1 }} className="bg-gray-600!">
				요청 대기중
			</Button>
		);
	} else if (result.friendRequestReceived) {
		/** 상대방이 친구 요청을 보내 수락 대기 중 */
		leftButton = (
			<Button size="lg" style={{ flex: 1 }} className="bg-secondary!">
				수락 대기중
			</Button>
		);
	} else if (result.friend) {
		/** 이미 친구인 상태 */
		leftButton = undefined;
	} else {
		/** 친구가 아닌 상태 */
		leftButton = (
			<Button
				size="lg"
				onClick={() => {
					sendFriendRequest();
				}}
				style={{ flex: 1 }}
				loading={isPending}
			>
				친구추가
			</Button>
		);
	}

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div className="flex w-full items-center gap-2">
			{leftButton}
			<OpenChatRoomButton memberId={result.memberId} className="flex-1" />
		</div>
	);
}
