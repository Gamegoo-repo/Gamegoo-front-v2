import { useMutation } from "@tanstack/react-query";
import { trackRollBtiEvent } from "../api";

/**
 * 롤BTI 이벤트 적재 mutation 훅
 *
 * - 인증 불필요: 비회원 포함 호출 가능
 * - onSuccess / onError 콜백은 호출부(페이지)에서 주입
 * - fire-and-forget 성격의 이벤트 로깅이므로 에러 핸들링은 선택적
 *
 * @example
 * const { mutate: trackEvent } = useTrackLolBtiEvent();
 * trackEvent({
 *   eventType: "START_TEST",
 *   sessionId: "sess_abc123",
 *   eventSource: "WEB",
 * });
 */
export const useTrackLolBtiEvent = () => {
	return useMutation({ mutationFn: trackRollBtiEvent });
};
