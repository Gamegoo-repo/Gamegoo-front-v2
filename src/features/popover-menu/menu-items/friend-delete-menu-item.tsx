import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api";
import {
	PopoverMenuItem,
	type PopoverMenuItemProps,
} from "../popover-menu-item";

interface FriendDeleteMenuItemProps {
	userId: number;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
}

export function FriendDeleteMenuItem({
	userId,
	onSuccess,
	onError,
	className,
}: FriendDeleteMenuItemProps) {
	const queryClient = useQueryClient();

	const deleteFriendMutation = useMutation({
		mutationFn: async (targetUserId: number) => {
			const response = await api.friend.deleteFriend(targetUserId);
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
		if (confirm("정말로 친구를 삭제하시겠습니까?")) {
			deleteFriendMutation.mutate(userId);
		}
	};

	const menuItemProps: PopoverMenuItemProps = {
		text: "친구 삭제",
		onClick: handleDeleteFriend,
		className,
	};

	return <PopoverMenuItem {...menuItemProps} />;
}
