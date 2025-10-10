import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api";
import {
	PopoverMenuItem,
	type PopoverMenuItemProps,
} from "../popover-menu-item";

interface BlockMenuItemProps {
	userId: number;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
}

export function BlockMenuItem({
	userId,
	onSuccess,
	onError,
	className,
}: BlockMenuItemProps) {
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
		if (confirm("정말로 이 사용자를 차단하시겠습니까?")) {
			blockUserMutation.mutate(userId);
		}
	};

	const menuItemProps: PopoverMenuItemProps = {
		text: "차단하기",
		onClick: handleBlockUser,
		className,
	};

	return <PopoverMenuItem {...menuItemProps} />;
}
