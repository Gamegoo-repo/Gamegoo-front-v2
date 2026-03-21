import { useMutation } from "@tanstack/react-query";
import { createPublicLolBtiResult } from "../api";

/**
 * 비회원 롤BTI 공개 결과 스냅샷 생성 mutation 훅
 *
 * - 비회원 전용 흐름에서 사용
 * - onSuccess / onError 콜백은 호출부에서 주입
 * - 상태 전환 책임은 상태를 소유한 컴포넌트에 위임
 */
export const useSaveGuestLolBtiResult = () => {
	return useMutation({ mutationFn: createPublicLolBtiResult });
};
