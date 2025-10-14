import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api";
import { useConfirmDialog } from "@/shared/providers";
import {
	PopoverMenuItem,
	type PopoverMenuItemProps,
} from "../popover-menu-item";

interface BlockMenuItemProps {
	userId: number;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
	onClosePopover?: () => void;
}

export function BlockMenuItem({
	userId,
	onSuccess,
	onError,
	className,
	onClosePopover,
}: BlockMenuItemProps) {
	const { showConfirmDialog } = useConfirmDialog();
	const queryClient = useQueryClient();

	const blockUserMutation = useMutation({
		mutationFn: async (targetUserId: number) => {
			const response = await api.block.blockMember(targetUserId);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blocked-users"] });
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
