import { useCallback } from "react";

interface AuthenticatedActionOptions {
	isAuthenticated: boolean;
	onUnauthenticated: () => void;
}

/**
 * 인증이 필요한 액션을 감싸는 커스텀 훅입니다.
 * 사용자가 인증된 경우에만 주어진 액션을 실행하고,
 * 그렇지 않은 경우 `onUnauthenticated` 콜백(예: 로그인 필요 모달 열기)을 실행합니다.
 *
 * 인증 상태·미인증 처리는 호출자가 주입한다 (shared 레이어 순수성 유지).
 *
 * @param action 인증이 필요한 액션 함수
 * @param options 인증 상태와 미인증 시 실행할 콜백
 * @returns 인증 로직이 적용된 새로운 함수
 */
export function useAuthenticatedAction<T extends (...args: any[]) => void>(
	action: T,
	{ isAuthenticated, onUnauthenticated }: AuthenticatedActionOptions,
) {
	return useCallback(
		(...args: Parameters<T>) => {
			if (isAuthenticated) {
				action(...args);
			} else {
				onUnauthenticated();
			}
		},
		[isAuthenticated, action, onUnauthenticated],
	);
}
