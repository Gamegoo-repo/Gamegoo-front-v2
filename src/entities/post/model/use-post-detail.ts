import { useQuery } from "@tanstack/react-query";
import { boardKeys } from "@/features/board/api/query-keys";
import {
	api,
	type ApiErrorResponse,
	type BoardByIdResponse,
	type BoardByIdResponseForMember,
} from "@/shared/api";
import type { AxiosError } from "axios";

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
			}
			const response = await api.public.board.getBoardById(postId);
			return response.data.data;
		},
		throwOnError: (error: AxiosError<ApiErrorResponse>) => {
			const errorCode = error?.response?.data?.code;

			const handledErrors = ["BOARD_401", "MEMBER_401", "AUTH_412"];

			if (handledErrors.includes(errorCode || "")) {
				return false;
			}

			// 나머지 에러는 Error Boundary로 throw
			return true;
		},
		meta: {
			// ErrorCatcher가 이 쿼리의 에러를 자동으로 토스트하지 않도록 설정
			skipErrorCatcher: true,
		},
		enabled: enabled,
		staleTime: 5 * 60 * 1000,
	});
};
