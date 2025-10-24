import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api";
import {
	PopoverMenuItem,
	type PopoverMenuItemProps,
} from "../popover-menu-item";

interface FriendAddMenuItemProps {
	userId: number;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
}

export function FriendAddMenuItem({
	userId,
	onSuccess,
	onError,
	className,
}: FriendAddMenuItemProps) {
	const queryClient = useQueryClient();

	const addFriendMutation = useMutation({
		mutationFn: async (targetUserId: number) => {
			const response = await api.friend.sendFriendRequest(targetUserId);
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

	const handleAddFriend = () => {
		addFriendMutation.mutate(userId);
	};

	const menuItemProps: PopoverMenuItemProps = {
		text: "친구 추가",
		onClick: handleAddFriend,
		className,
	};

	return <PopoverMenuItem {...menuItemProps} />;
}
