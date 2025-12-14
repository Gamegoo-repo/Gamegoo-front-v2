import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api";
import { toast } from "@/shared/lib/toast";
import { boardKeys } from "./query-keys";

export const useBumpPost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const response = await api.private.board.bumpLatestBoard();
			return response.data.data;
		},
		onSuccess: () => {
			toast.confirm("끌어올리기가 완료되었습니다.");

			// 쿼리 무효
			return queryClient.invalidateQueries({
				queryKey: boardKeys.all,
			});
		},
	});
};
