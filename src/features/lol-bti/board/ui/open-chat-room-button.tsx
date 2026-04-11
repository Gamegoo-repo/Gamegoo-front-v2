import { useOpenChatroom } from "@/features/chat/hooks/use-open-chatroom";
import { api } from "@/shared/api";
import { useAuthenticatedAction } from "@/shared/hooks/use-authenticated-action";
import { cn } from "@/shared/lib/utils";
import { Button } from "@gamegoo-ui/design-system";

export default function OpenChatRoomButton({
	memberId,
	className,
}: {
	memberId: number;
	className?: string;
}) {
	const openChatRoom = useOpenChatroom();

	const handleStartChat = useAuthenticatedAction(async () => {
		openChatRoom(
			async () => await api.private.chat.startChatroomByMemberId(memberId),
		);
	});
	return (
		<Button
			type="button"
			size="lg"
			variant="black"
			onClick={handleStartChat}
			className={cn("w-full! rounded-xl!", className)}
		>
			말 걸어보기
		</Button>
	);
}
