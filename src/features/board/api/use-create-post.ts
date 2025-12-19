import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type BoardInsertRequest } from "@/shared/api";
import { boardKeys } from "./query-keys";

export const useCreatePost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (postData: BoardInsertRequest) => {
			const response = await api.private.board.boardInsert(postData);
			return response.data.data;
		},
		onSuccess: () => {
			return queryClient.invalidateQueries({
				queryKey: boardKeys.all,
			});
		},
	});
};
