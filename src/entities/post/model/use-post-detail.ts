import { useQuery } from "@tanstack/react-query";
import { boardKeys } from "@/features/board/api/query-keys";
import {
	api,
	type BoardByIdResponse,
	type BoardByIdResponseForMember,
} from "@/shared/api";

/**
 * `PostDetail`:게시판 상세모달의 데이터 타입
 * - 회원: `ApiResponseBoardByIdResponseForMember`
 * - 비회원: `ApiResponseBoardByIdResponse`
 */
export type PostDetail = BoardByIdResponseForMember | BoardByIdResponse;

export function isAuthenticatedPostDetail(
	data: PostDetail,
): data is BoardByIdResponseForMember {
	return "isBlocked" in data;
}

export const usePostDetail = (
	isAuthenticated: boolean,
	postId: number,
	enabled = true,
) => {
	return useQuery({
		queryKey: boardKeys.detail(postId, isAuthenticated),
		queryFn: async () => {
			if (isAuthenticated) {
				const response = await api.private.board.getBoardByIdForMember(postId);
				return response.data.data;
			} else {
				const response = await api.public.board.getBoardById(postId);
				return response.data.data;
			}
		},
		enabled: enabled,
		staleTime: 5 * 60 * 1000,
	});
};
