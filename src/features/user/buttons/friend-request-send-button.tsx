import { useSendFriendRequest } from "@/features/user/hooks/use-send-friend-request";
import { useAuth } from "@/shared/model/use-auth";
import { Button } from "@/shared/ui";

export default function FriendRequestSendButton({
	userId,
}: {
	userId: number;
}) {
	const { user } = useAuth();
	const { mutate } = useSendFriendRequest(userId);

	if (!user?.id) return null;

	return (
		<Button
			variant={"black"}
			size="xl"
			className="bold-14 h-[45px] mobile:w-[218px] w-full mobile:rounded-xl rounded-[6px]"
			onClick={() => mutate()}
		>
			친구 추가
		</Button>
	);
}
