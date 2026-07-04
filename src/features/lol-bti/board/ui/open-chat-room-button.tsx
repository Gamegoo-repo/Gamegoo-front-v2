import { Button } from "@gamegoo-ui/design-system";
import { useAuth, useLoginRequiredModalStore } from "@/entities/auth";
import { useOpenChatroom } from "@/features/chat/hooks/use-open-chatroom";
import { api } from "@/shared/api";
import { useAuthenticatedAction } from "@/shared/hooks/use-authenticated-action";
import { cn } from "@/shared/lib/utils";

export default function OpenChatRoomButton({
	memberId,
	className,
}: {
	memberId: number;
	className?: string;
}) {
	const openChatRoom = useOpenChatroom();
	const { isAuthenticated } = useAuth();
	const openLoginRequiredModal = useLoginRequiredModalStore((s) => s.openModal);

	const handleStartChat = useAuthenticatedAction(
		async () => {
			openChatRoom(
				async () => await api.private.chat.startChatroomByMemberId(memberId),
			);
		},
		{ isAuthenticated, onUnauthenticated: openLoginRequiredModal },
	);
	return (
		<Button
			type="button"
			size="lg"
			variant="black"
			onClick={(e) => {
				e.stopPropagation();
				handleStartChat();
			}}
			className={cn("w-full! rounded-xl!", className)}
		>
			말 걸어보기
		</Button>
	);
}
