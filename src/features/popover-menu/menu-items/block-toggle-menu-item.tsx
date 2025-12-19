import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/entities/user/config/query-keys";
import { api } from "@/shared/api";
import { useConfirmDialog } from "@/shared/providers";
import type { UserRelationshipStatus } from "@/widgets/user-info/model/user-info.types";
import {
	PopoverMenuItem,
	type PopoverMenuItemProps,
} from "../popover-menu-item";

interface BlockMenuItemProps {
	userId: number;
	relationshipStatus: UserRelationshipStatus;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
	onClosePopover?: () => void;
}

export function BlockToggleMenu({
	userId,
	relationshipStatus,
	onSuccess,
	onError,
	className,
	onClosePopover,
}: BlockMenuItemProps) {
	const { showConfirmDialog } = useConfirmDialog();
	const queryClient = useQueryClient();

	const isBlocked = relationshipStatus === "blocked";

	const toggleBlockMutation = useMutation({
		mutationFn: async (targetUserId: number) => {
			const response = isBlocked
				? await api.private.block.unblockMember(targetUserId)
				: await api.private.block.blockMember(targetUserId);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.blocked() });
			queryClient.invalidateQueries({
				queryKey: userKeys.profile(userId),
			});
			onSuccess?.();
		},
		onError: (error) => {
			onError?.(error);
		},
	});

	const handleToggleBlock = () => {
		onClosePopover?.();
		showConfirmDialog({
			title: isBlocked ? "차단을 해제하시겠습니까?" : "차단하시겠습니까?",
			description: isBlocked
				? ""
				: `차단한 상대에게는 메시지를 받을 수 없으며,\n
매칭이 이루어지지 않습니다.`,
			confirmText: isBlocked ? "해제" : "차단",
			onConfirm: () => toggleBlockMutation.mutate(userId),
		});
	};

	const menuItemProps: PopoverMenuItemProps = {
		text: isBlocked ? "차단 해제" : "차단하기",
		onClick: handleToggleBlock,
		className,
	};

	return <PopoverMenuItem {...menuItemProps} />;
}
