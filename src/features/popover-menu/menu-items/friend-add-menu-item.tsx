import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/entities/user/config/query-keys";
import { api } from "@/shared/api";
import {
	PopoverMenuItem,
	type PopoverMenuItemProps,
} from "../popover-menu-item";
import { chatKeys } from "@/entities/chat/config/query-keys";

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
			const response = await api.private.friend.sendFriendRequest(targetUserId);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.friend() });
			queryClient.invalidateQueries({ queryKey: userKeys.profile(userId) });
			queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
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
