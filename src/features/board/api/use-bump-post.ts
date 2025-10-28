import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type ApiErrorResponse, api } from "@/shared/api";

export const useBumpPost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const response = await api.private.board.bumpLatestBoard();
			return response.data.data;
		},
		onSuccess: () => {
			/** TODO - 토스트메세지로 바꿔야 할 부분 */
			alert("끌어올리기 완료!");

			// 쿼리 무효
			return queryClient.invalidateQueries({
				queryKey: ["boards"],
			});
		},
		onError: (error: AxiosError<ApiErrorResponse>) => {
			console.log(error);
		},
	});
};
