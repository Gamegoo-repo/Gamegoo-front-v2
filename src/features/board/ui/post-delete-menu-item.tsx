import { useMutation } from "@tanstack/react-query";
import {
	PopoverMenuItem,
	type PopoverMenuItemProps,
} from "@/features/popover-menu";
import { api } from "@/shared/api";
import { queryClient } from "@/shared/lib/query-client";
import { boardKeys } from "../api/query-keys";

interface PostDeleteMenuItemProps {
	postId: number;
	onClosePopover?: () => void;
}

export function PostDeleteMenuItem({
	postId,
	onClosePopover,
}: PostDeleteMenuItemProps) {
	const deletePostMutation = useMutation({
		mutationFn: async () => {
			const response = await api.private.board._delete(postId);
			return response.data;
		},
		onSuccess: () => {
			/** TODO: 쿼리 무효화 all로 해도 되는게 맞을지? */
			queryClient.invalidateQueries({ queryKey: boardKeys.all });
			alert("게시물을 삭제했습니다.");
		},
		onError: (error) => {
			// alert("게시물을 삭제에 실패했습니다.");
			console.log(error);
		},
	});

	const menuItemProps: PopoverMenuItemProps = {
		text: "삭제하기",
		onClick: () => {
			deletePostMutation.mutate();
			onClosePopover?.();
		},
		className: "text-red-600",
	};

	return <PopoverMenuItem {...menuItemProps} />;
}
