import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "@/entities/chat/config/query-keys";
import { userKeys } from "@/entities/user/config/query-keys";
import { api } from "@/shared/api";
import { useConfirmDialog } from "@/shared/providers";
import {
	PopoverMenuItem,
	type PopoverMenuItemProps,
} from "../popover-menu-item";

interface FriendRequestDeclineMenuItemProps {
	userId: number;
	chatroomUuid?: string;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
	onClosePopover?: () => void;
}

export function FriendRequestDeclineMenuItem({
	userId,
	chatroomUuid,
	onSuccess,
	onError,
	className,
	onClosePopover,
}: FriendRequestDeclineMenuItemProps) {
	const { showConfirmDialog } = useConfirmDialog();
	const queryClient = useQueryClient();

	const rejectMutation = useMutation({
		mutationFn: async (memberId: number) => {
			const response = await api.private.friend.rejectFriendRequest(memberId);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.friend() });
			queryClient.invalidateQueries({ queryKey: userKeys.profile(userId) });
			queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
			if (chatroomUuid) {
				queryClient.invalidateQueries({
					queryKey: chatKeys.enter(chatroomUuid),
				});
			}
			onSuccess?.();
		},
		onError: (error) => {
			onError?.(error);
		},
	});

	const handleReject = () => {
		onClosePopover?.();
		showConfirmDialog({
			title: "친구 요청을 거절하시겠습니까?",
			description: "",
			confirmText: "거절",
			onConfirm: () => rejectMutation.mutate(userId),
		});
	};

	const menuItemProps: PopoverMenuItemProps = {
		text: "친구 요청 거절",
		onClick: handleReject,
		className,
	};

	return <PopoverMenuItem {...menuItemProps} />;
}
