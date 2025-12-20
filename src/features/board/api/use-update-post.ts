import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
	type ApiErrorResponse,
	api,
	type BoardUpdateRequest,
} from "@/shared/api";
import { boardKeys } from "./query-keys";

export const useUpdatePost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			postId,
			postData,
		}: {
			postId: number;
			postData: BoardUpdateRequest;
		}) => {
			const response = await api.private.board.boardUpdate(postId, postData);
			return response.data.data;
		},
		onSuccess: () => {
			return queryClient.invalidateQueries({
				queryKey: boardKeys.all,
			});
		},
		onError: (error: AxiosError<ApiErrorResponse>) => {
			console.log(error);
		},
		meta: {
			handledErrorCodes: ["BOARD_408"],
		},
	});
};
