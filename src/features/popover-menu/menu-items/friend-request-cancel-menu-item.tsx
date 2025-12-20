import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "@/entities/chat/config/query-keys";
import { userKeys } from "@/entities/user/config/query-keys";
import { api } from "@/shared/api";
import { useConfirmDialog } from "@/shared/providers";
import {
	PopoverMenuItem,
	type PopoverMenuItemProps,
} from "../popover-menu-item";

interface FriendRequestCancelMenuItemProps {
	userId: number;
	chatroomUuid?: string;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
	onClosePopover?: () => void;
}

export function FriendRequestCancelMenuItem({
	userId,
	chatroomUuid,
	onSuccess,
	onError,
	className,
	onClosePopover,
}: FriendRequestCancelMenuItemProps) {
	const { showConfirmDialog } = useConfirmDialog();
	const queryClient = useQueryClient();

	const cancelMutation = useMutation({
		mutationFn: async (memberId: number) => {
			const response = await api.private.friend.cancelFriendRequest(memberId);
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

	const handleCancel = () => {
		onClosePopover?.();
		showConfirmDialog({
			title: "친구 요청을 취소하시겠습니까?",
			description: "",
			confirmText: "취소",
			onConfirm: () => cancelMutation.mutate(userId),
		});
	};

	const menuItemProps: PopoverMenuItemProps = {
		text: "친구 요청 취소",
		onClick: handleCancel,
		className,
	};

	return <PopoverMenuItem {...menuItemProps} />;
}
