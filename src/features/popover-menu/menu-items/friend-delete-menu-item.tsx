import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api";
import { useConfirmDialog } from "@/shared/providers";
import {
	PopoverMenuItem,
	type PopoverMenuItemProps,
} from "../popover-menu-item";

interface FriendDeleteMenuItemProps {
	userId: number;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
	onClosePopover?: () => void;
}

export function FriendDeleteMenuItem({
	userId,
	onSuccess,
	onError,
	className,
	onClosePopover,
}: FriendDeleteMenuItemProps) {
	const { showConfirmDialog } = useConfirmDialog();
	const queryClient = useQueryClient();

	const deleteFriendMutation = useMutation({
		mutationFn: async (targetUserId: number) => {
			const response = await api.private.friend.deleteFriend(targetUserId);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["friends"] });
			onSuccess?.();
		},
		onError: (error) => {
			onError?.(error);
		},
	});

	const handleDeleteFriend = () => {
		onClosePopover?.();
		showConfirmDialog({
			title: "친구를 삭제하시겠습니까?",
			description: "이 작업은 되돌릴 수 없습니다.",
			confirmText: "삭제",
			onConfirm: () => deleteFriendMutation.mutate(userId),
		});
	};

	const menuItemProps: PopoverMenuItemProps = {
		text: "친구 삭제",
		onClick: handleDeleteFriend,
		className,
	};

	return <PopoverMenuItem {...menuItemProps} />;
}
