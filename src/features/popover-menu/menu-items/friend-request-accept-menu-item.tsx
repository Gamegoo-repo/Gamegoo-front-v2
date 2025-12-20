import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "@/entities/chat/config/query-keys";
import { userKeys } from "@/entities/user/config/query-keys";
import { api } from "@/shared/api";
import { useConfirmDialog } from "@/shared/providers";
import {
	PopoverMenuItem,
	type PopoverMenuItemProps,
} from "../popover-menu-item";

interface FriendRequestAcceptMenuItemProps {
	userId: number;
	chatroomUuid?: string;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
	onClosePopover?: () => void;
}

export function FriendRequestAcceptMenuItem({
	userId,
	chatroomUuid,
	onSuccess,
	onError,
	className,
	onClosePopover,
}: FriendRequestAcceptMenuItemProps) {
	const { showConfirmDialog } = useConfirmDialog();
	const queryClient = useQueryClient();

	const acceptMutation = useMutation({
		mutationFn: async (memberId: number) => {
			const response = await api.private.friend.acceptFriendRequest(memberId);
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

	const handleAccept = () => {
		onClosePopover?.();
		showConfirmDialog({
			title: "친구 요청을 수락하시겠습니까?",
			description: "",
			confirmText: "수락",
			onConfirm: () => acceptMutation.mutate(userId),
		});
	};

	const menuItemProps: PopoverMenuItemProps = {
		text: "친구 요청 수락",
		onClick: handleAccept,
		className,
	};

	return <PopoverMenuItem {...menuItemProps} />;
}
