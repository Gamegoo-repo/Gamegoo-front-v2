import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api";
import { useConfirmDialog } from "@/shared/providers";
import {
	PopoverMenuItem,
	type PopoverMenuItemProps,
} from "../popover-menu-item";

interface ChatroomLeaveMenuItemProps {
	chatroomId: string;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
	onClosePopover?: () => void;
}

export function ChatroomLeaveMenuItem({
	chatroomId,
	onSuccess,
	onError,
	className,
	onClosePopover,
}: ChatroomLeaveMenuItemProps) {
	const { showConfirmDialog } = useConfirmDialog();
	const queryClient = useQueryClient();

	const leaveChatroomMutation = useMutation({
		mutationFn: async (targetChatroomId: string) => {
			const response = await api.private.chat.exitChatroom(targetChatroomId);
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
		onClosePopover?.();
		showConfirmDialog({
			title: "채팅방을 나가시겠습니까?",
			description: "채팅 기록이 모두 삭제됩니다.",
			confirmText: "나가기",
			onConfirm: () => leaveChatroomMutation.mutate(chatroomId),
		});
	};

	const menuItemProps: PopoverMenuItemProps = {
		text: "채팅방 나가기",
		onClick: handleLeaveChatroom,
		className,
	};

	return <PopoverMenuItem {...menuItemProps} />;
}
