import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api";
import {
	PopoverMenuItem,
	type PopoverMenuItemProps,
} from "../popover-menu-item";

interface ChatroomLeaveMenuItemProps {
	chatroomId: string;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
}

export function ChatroomLeaveMenuItem({
	chatroomId,
	onSuccess,
	onError,
	className,
}: ChatroomLeaveMenuItemProps) {
	const queryClient = useQueryClient();

	const leaveChatroomMutation = useMutation({
		mutationFn: async (targetChatroomId: string) => {
			const response = await api.chat.exitChatroom(targetChatroomId);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["chatrooms"] });
			onSuccess?.();
		},
		onError: (error) => {
			onError?.(error);
		},
	});

	const handleLeaveChatroom = () => {
		if (confirm("정말로 채팅방을 나가시겠습니까?")) {
			leaveChatroomMutation.mutate(chatroomId);
		}
	};

	const menuItemProps: PopoverMenuItemProps = {
		text: "채팅방 나가기",
		onClick: handleLeaveChatroom,
		className,
	};

	return <PopoverMenuItem {...menuItemProps} />;
}
