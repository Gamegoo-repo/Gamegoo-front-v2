import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "@/entities/chat/config/query-keys";
import { userKeys } from "@/entities/user/config/query-keys";
import { api } from "@/shared/api";
import { useConfirmDialog } from "@/shared/providers";
import {
	PopoverMenuItem,
	type PopoverMenuItemProps,
} from "../popover-menu-item";

interface BlockMenuItemProps {
	userId: number;
	chatroomUuid?: string;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
	onClosePopover?: () => void;
}

export function BlockMenuItem({
	userId,
	chatroomUuid,
	onSuccess,
	onError,
	className,
	onClosePopover,
}: BlockMenuItemProps) {
	const { showConfirmDialog } = useConfirmDialog();
	const queryClient = useQueryClient();

	const blockUserMutation = useMutation({
		mutationFn: async (targetUserId: number) => {
			const response = await api.private.block.blockMember(targetUserId);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.blocked() });
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

	const handleBlockUser = () => {
		onClosePopover?.();
		showConfirmDialog({
			title: "이 사용자를 차단하시겠습니까?",
			description: "차단된 사용자와의 모든 상호작용이 제한됩니다.",
			confirmText: "차단",
			onConfirm: () => blockUserMutation.mutate(userId),
		});
	};

	const menuItemProps: PopoverMenuItemProps = {
		text: "차단하기",
		onClick: handleBlockUser,
		className,
	};

	return <PopoverMenuItem {...menuItemProps} />;
}
