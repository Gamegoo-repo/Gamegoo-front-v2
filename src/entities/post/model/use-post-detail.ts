import { useQuery } from "@tanstack/react-query";
import { boardKeys } from "@/features/board/api/query-keys";
import { api } from "@/shared/api";

export const usePostDetail = (postId: number, enabled = true) => {
	return useQuery({
		queryKey: boardKeys.detail(postId),
		queryFn: () => api.private.board.getBoardById(postId),
		enabled: enabled,
		select: (data) => data?.data.data,
		staleTime: 5 * 60 * 1000,
	});
};
