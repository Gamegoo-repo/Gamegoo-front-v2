import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api";
import { useConfirmDialog } from "@/shared/providers";
import {
	PopoverMenuItem,
	type PopoverMenuItemProps,
} from "../popover-menu-item";

interface UnblockMenuItemProps {
	userId: number;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
	onClosePopover?: () => void;
}

export function UnblockMenuItem({
	userId,
	onSuccess,
	onError,
	className,
	onClosePopover,
}: UnblockMenuItemProps) {
	const { showConfirmDialog } = useConfirmDialog();
	const queryClient = useQueryClient();

	const unblockUserMutation = useMutation({
		mutationFn: async (targetUserId: number) => {
			const response = await api.private.block.unblockMember(targetUserId);
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

	const handleUnblockUser = () => {
		onClosePopover?.();
		showConfirmDialog({
			title: "차단을 해제하시겠습니까?",
			description: "",
			confirmText: "해제",
			onConfirm: () => unblockUserMutation.mutate(userId),
		});
	};

	const menuItemProps: PopoverMenuItemProps = {
		text: "차단 해제",
		onClick: handleUnblockUser,
		className,
	};

	return <PopoverMenuItem {...menuItemProps} />;
}
