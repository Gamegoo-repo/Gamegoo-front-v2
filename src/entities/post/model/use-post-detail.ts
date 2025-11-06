import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";

export const usePostDetail = (postId: number) => {
	return useQuery({
		queryKey: ["posts", postId],
		queryFn: () => api.private.board.getBoardById(postId),
		select: (data) => data?.data.data,
		staleTime: 5 * 60 * 1000,
	});
};
