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
		/** TODO: MEMBER_401랑 AUTH_412를 여기서 처리하는게 맞는지 확인*/
		meta: {
			// 나머지 에러는 ErrorCatcher가 자동으로 토스트 표시
			handledErrorCodes: ["BOARD_401", "MEMBER_401", "AUTH_412"],
		},
		enabled: enabled,
		staleTime: 5 * 60 * 1000,
	});
};
