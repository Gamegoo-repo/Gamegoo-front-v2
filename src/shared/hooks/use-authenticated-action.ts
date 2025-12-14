import { useCallback } from "react";
import { useLoginRequiredModalStore } from "@/features/auth";
import { useAuth } from "@/shared/model/use-auth";

/**
 * 인증이 필요한 액션을 감싸는 커스텀 훅입니다.
 * 사용자가 인증된 경우에만 주어진 액션을 실행하고,
 * 그렇지 않은 경우 로그인 필요 모달을 엽니다.
 *
 * @param action 인증이 필요한 액션 함수
 * @returns 인증 로직이 적용된 새로운 함수
 */
export function useAuthenticatedAction<T extends (...args: any[]) => void>(
	action: T,
) {
	const { isAuthenticated } = useAuth();
	const openLoginRequiredModal = useLoginRequiredModalStore(
		(state) => state.openModal,
	);

	return useCallback(
		(...args: Parameters<T>) => {
			if (isAuthenticated) {
				action(...args);
			} else {
				openLoginRequiredModal();
			}
		},
		[isAuthenticated, action, openLoginRequiredModal],
	);
}
