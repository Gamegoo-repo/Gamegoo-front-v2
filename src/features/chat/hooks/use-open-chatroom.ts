import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { isAxiosError } from "axios";
import { useChatStore } from "@/entities/chat";
import { chatKeys } from "@/entities/chat/config/query-keys";
import { useChatDialogStore } from "@/entities/chat/store/use-chat-dialog-store";
import type {
	ApiErrorResponse,
	ApiResponseEnterChatroomResponse,
} from "@/shared/api";
import { api } from "@/shared/api";
import { toast } from "@/shared/lib/toast";
import { createChatroom } from "../lib/chatroom-utils";

/** 채팅방 오픈 API 호출 함수의 타입 */
type OpenChatroomApi = () => Promise<
	AxiosResponse<ApiResponseEnterChatroomResponse>
>;

/**
 * 채팅방 오픈 공통 로직을 처리하는 훅.
 * API 호출 함수(startChatroomByBoardId / startChatroomByMemberId)를 주입받아
 * 이후 공통 처리(prefetch, 목록 갱신, 다이얼로그 오픈)를 담당한다.
 *
 * @param options.onSuccess - 채팅방 오픈 성공 시 실행할 콜백 (예: 모달 닫기)
 */
export function useOpenChatroom(options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient();
	const { updateChatroom } = useChatStore();
	const {
		setChatroom,
		setChatDialogType,
		openDialog,
		setSystemData,
		clearSystemData,
	} = useChatDialogStore();

	// 게시글 기반 채팅(startChatroomByBoardId)의 경우에만 system 정보가 존재
	const handleSystemData = useCallback(
		(chatroomData: NonNullable<ApiResponseEnterChatroomResponse["data"]>) => {
			if (chatroomData.system) {
				setSystemData({
					flag: chatroomData.system.flag,
					boardId: chatroomData.system.boardId,
				});
			} else {
				clearSystemData();
			}
		},
		[setSystemData, clearSystemData],
	);

	// 첫 메시지 전송 전 system 플래그가 준비되도록 채팅방 입장 데이터 미리 로드
	const prefetchChatroom = useCallback(
		async (uuid: string) => {
			await queryClient.prefetchQuery({
				queryKey: chatKeys.enter(uuid),
				queryFn: async () => {
					const enterRes = await api.private.chat.enterChatroom(uuid);
					return enterRes.data;
				},
			});
		},
		[queryClient],
	);

	const openChatroom = useCallback(
		async (apiCall: OpenChatroomApi) => {
			try {
				const response = await apiCall();
				const chatroomData = response.data?.data;

				if (!chatroomData?.uuid) {
					return;
				}

				handleSystemData(chatroomData);

				const chatroom = createChatroom(chatroomData);

				await prefetchChatroom(chatroom.uuid);

				// 채팅방 목록 낙관적 업데이트 후 서버 재동기화
				updateChatroom(chatroom);
				void queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });

				setChatroom(chatroom);
				setChatDialogType("chatroom");
				openDialog();
				options?.onSuccess?.();
			} catch (e) {
				console.error("채팅방 시작 실패:", e);

				const DEFAULT_ERROR_MESSAGE =
					"채팅방을 여는 데 실패했습니다. 잠시 후 다시 시도해주세요.";

				const errorMessage = isAxiosError<ApiErrorResponse>(e)
					? (e.response?.data?.message ?? DEFAULT_ERROR_MESSAGE)
					: DEFAULT_ERROR_MESSAGE;

				toast.error(errorMessage);
			}
		},
		[
			handleSystemData,
			prefetchChatroom,
			updateChatroom,
			queryClient,
			setChatroom,
			setChatDialogType,
			openDialog,
			options,
		],
	);

	return openChatroom;
}
