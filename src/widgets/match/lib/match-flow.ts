import { socketManager } from "@/shared/api/socket";
import { toast } from "@/shared/lib/toast";
import type {
	JwtExpiredErrorPayload,
	MatchEventName,
	MatchEventPayloadMap,
} from "./match-event-manager";
import { matchEventManager } from "./match-event-manager";
import type { MatchingRequest } from "./matching-types";
import { useMatchUiStore } from "../model/store/useMatchUiStore";

const TICK_MS = 1000;
const MAX_DURATION_SEC = 300;

/**
 * 매칭의 '동작'을 메서드 단위로 제공하는 상위 레벨 유즈케이스 모음
 * - start, retry, cancel(quit), reject, complete 등
 * - 내부적으로 중복 전송 방지와 재연결 재전송을 보조합니다.
 */
class MatchFlow {
	private static instance: MatchFlow;

	private didSendInitialRequest = false;
	private shouldResendOnConnect = false;
	private lastRequest: (MatchingRequest & { memberId?: number }) | null = null;
	private currentThreshold: number | null = null;
	/**
	 * 소켓이 순간적으로 끊긴 상태에서 send()가 호출되면 SocketManager가 warn만 찍고 드랍합니다.
	 * 매칭은 "드랍"되면 사용자 입장에선 재요청이 안 된 것처럼 보일 수 있어,
	 * 세션 단위로 outgoing 이벤트를 큐잉해 connect 시점에 flush 합니다.
	 */
	private pendingOutgoing: Array<{
		event: string;
		data?: unknown;
		sessionId: number;
	}> = [];
	private phase:
		| "idle"
		| "searching"
		| "found"
		| "completing"
		| "completed"
		| "cancelled" = "idle";
	private successReceiverSent = false;
	private successFinalSent = false;
	private isSocketBound = false;
	private listeners = new Map<
		MatchEventName,
		Set<(payload: unknown) => void>
	>();
	private sessionIdCounter = 0;
	private currentSessionId = 0;
	private pendingCancelTimer: ReturnType<typeof setTimeout> | null = null;
	private pendingCancelSessionId: number | null = null;

	private endAt = 0;
	private uiTimerId: number | null = null;

	static getInstance(): MatchFlow {
		if (!MatchFlow.instance) {
			MatchFlow.instance = new MatchFlow();
		}
		return MatchFlow.instance;
	}

	private clearUiTimer() {
		if (this.uiTimerId !== null) {
			window.clearInterval(this.uiTimerId);
			this.uiTimerId = null;
		}
	}

	private startUiTimer(durationSec: number) {
		this.clearUiTimer();
		this.endAt = Date.now() + durationSec * TICK_MS;

		const { start, tick } = useMatchUiStore.getState();
		start(this.currentSessionId, durationSec);

		this.uiTimerId = window.setInterval(() => {
			const left = Math.max(0, Math.ceil((this.endAt - Date.now()) / TICK_MS));
			tick(left);

			if (left <= 0) {
				this.markNotFound();
				this.stopUi();
			}
		}, TICK_MS);
	}

	private stopUi() {
		this.clearUiTimer();
		useMatchUiStore.getState().stop();
		this.endAt = 0;
	}

	// === Lifecycle / wiring ===
	private ensureSocketBinding(): void {
		if (this.isSocketBound) return;
		this.isSocketBound = true;

		const forward =
			<E extends MatchEventName>(event: E) =>
			(...args: unknown[]) => {
				// 내부 상태 갱신
				this.handleInternalStateByEvent(event);

				if (event === "connect") {
					this.handleConnect();
				} else if (event === "jwt-expired-error") {
					this.onJwtExpired(args[0] as JwtExpiredErrorPayload);
				}
				this.emit(event, args[0] as MatchEventPayloadMap[E]);
			};

		matchEventManager.on("connect", forward("connect"));
		matchEventManager.on("jwt-expired-error", forward("jwt-expired-error"));
		matchEventManager.on("matching-started", forward("matching-started"));
		matchEventManager.on("matching-count", forward("matching-count"));
		matchEventManager.on(
			"matching-found-sender",
			forward("matching-found-sender"),
		);
		matchEventManager.on(
			"matching-found-receiver",
			forward("matching-found-receiver"),
		);
		matchEventManager.on("matching-not-found", forward("matching-not-found"));
		matchEventManager.on("matching-fail", forward("matching-fail"));
		matchEventManager.on("matching-success", forward("matching-success"));
		matchEventManager.on(
			"matching-success-sender",
			forward("matching-success-sender"),
		);
	}

	private handleInternalStateByEvent(event: MatchEventName) {
		// 서버 이벤트가 와도 UI/phase가 꼬이지 않게 최소 동기화
		if (
			event === "matching-found-sender" ||
			event === "matching-found-receiver"
		) {
			// 상대를 찾은 상태(complete 화면으로 넘어가기 전)
			if (this.phase === "searching") this.phase = "found";
			return;
		}

		if (event === "matching-not-found" || event === "matching-fail") {
			// 서버가 종료시킴 → UI도 즉시 꺼야 함
			this.phase = "idle";
			this.stopUi();
			return;
		}

		if (event === "matching-success") {
			this.phase = "completed";
			this.stopUi();
			return;
		}
	}

	private emit<E extends MatchEventName>(
		event: E,
		payload: MatchEventPayloadMap[E],
	): void {
		const set = this.listeners.get(event);
		if (!set || set.size === 0) return;
		for (const listener of set) {
			try {
				(listener as (p: MatchEventPayloadMap[E]) => void)(payload);
			} catch (e) {
				console.error(`[matchFlow] listener error on ${event}:`, e);
			}
		}
	}

	on<E extends MatchEventName>(
		event: E,
		listener: (payload: MatchEventPayloadMap[E]) => void,
	): () => void {
		this.ensureSocketBinding();
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new Set());
		}
		const set = this.listeners.get(event);
		if (set) {
			set.add(listener as unknown as (payload: unknown) => void);
		} else {
			this.listeners.set(
				event,
				new Set([listener as unknown as (payload: unknown) => void]),
			);
		}
		return () => this.off(event, listener);
	}

	off<E extends MatchEventName>(
		event: E,
		listener?: (payload: MatchEventPayloadMap[E]) => void,
	): void {
		if (!listener) {
			this.listeners.delete(event);
			return;
		}
		const set = this.listeners.get(event);
		if (!set) return;
		set.delete(listener as unknown as (payload: unknown) => void);
		if (set.size === 0) {
			this.listeners.delete(event);
		}
	}

	private handleConnect(): void {
		// 1) 매칭-request는 기존 플로우대로 우선 처리
		if (!this.lastRequest) return;
		// 연결 직후: 초기 전송을 안 했으면 최초 요청 전송
		if (!this.didSendInitialRequest) {
			this.didSendInitialRequest = true;
			const threshold =
				this.currentThreshold ?? this.lastRequest.threshold ?? 0;
			this.sendOrQueue("matching-request", {
				...this.lastRequest,
				threshold,
			});
			this.flushPendingOutgoing();
			return;
		}
		// JWT 만료 등으로 재전송 플래그가 켜진 경우에만 재전송
		if (this.shouldResendOnConnect) {
			this.shouldResendOnConnect = false;
			const threshold =
				this.currentThreshold ?? this.lastRequest.threshold ?? 0;
			this.sendOrQueue("matching-request", {
				...this.lastRequest,
				threshold,
			});
		}
		// 2) 그 외 보류된 outgoing 이벤트 flush
		this.flushPendingOutgoing();
	}

	onJwtExpired(_payload?: JwtExpiredErrorPayload): void {
		// jwt-expired-error는 일반적으로 reconnect를 강제하지 않기 때문에
		// "connect 시 재전송"만 해두면 실제 재요청이 안 나갈 수 있습니다.
		// 연결돼 있으면 즉시 matching-request를 재전송하고,
		// 끊겨있으면 connect 시 재전송 플래그로 fallback 합니다.
		this.didSendInitialRequest = false;
		this.shouldResendOnConnect = true;

		const canImmediateResend =
			!!this.lastRequest &&
			socketManager.connected &&
			(this.phase === "searching" || this.phase === "found");

		if (canImmediateResend) {
			// 즉시 재전송이면 connect 훅에서의 중복 재전송을 막음
			this.shouldResendOnConnect = false;
			this.handleConnect();
		}
	}

	reset(): void {
		this.didSendInitialRequest = false;
		this.shouldResendOnConnect = false;
		this.lastRequest = null;
		this.currentThreshold = null;
		this.phase = "idle";
		this.successReceiverSent = false;
		this.successFinalSent = false;
		// 이전 세션/단계의 보류 이벤트는 모두 폐기
		this.pendingOutgoing = [];
		// cancel 스케줄이 남아있으면 정리 (다음 매칭에 영향 방지)
		if (this.pendingCancelTimer) {
			clearTimeout(this.pendingCancelTimer);
			this.pendingCancelTimer = null;
		}
		this.pendingCancelSessionId = null;

		this.stopUi();
	}

	private sendOrQueue(event: string, data?: unknown): void {
		if (socketManager.connected) {
			socketManager.send(event, data);
			return;
		}
		// 연결이 아닌 경우 세션 단위로 큐잉 (동일 이벤트는 최신값으로 덮어씀)
		const existingIdx = this.pendingOutgoing.findIndex(
			(p) => p.sessionId === this.currentSessionId && p.event === event,
		);
		const payload = { event, data, sessionId: this.currentSessionId };
		if (existingIdx >= 0) {
			this.pendingOutgoing[existingIdx] = payload;
		} else {
			this.pendingOutgoing.push(payload);
		}
	}

	private flushPendingOutgoing(): void {
		if (!socketManager.connected) return;
		if (this.pendingOutgoing.length === 0) return;

		const currentSessionId = this.currentSessionId;
		const toFlush = this.pendingOutgoing.filter(
			(p) => p.sessionId === currentSessionId,
		);
		// flush 후 현재 세션 것만 제거
		this.pendingOutgoing = this.pendingOutgoing.filter(
			(p) => p.sessionId !== currentSessionId,
		);

		for (const item of toFlush) {
			socketManager.send(item.event, item.data);
		}
	}

	// === Actions (동작) ===
	start(request: MatchingRequest & { memberId?: number }): boolean {
		// 이미 완료/진행 중이면 중복 시작 방지
		if (
			this.phase === "searching" ||
			this.phase === "found" ||
			this.phase === "completing"
		) {
			return false;
		}
		this.currentSessionId = this.sessionIdCounter + 1;
		this.sessionIdCounter = this.currentSessionId;
		// 새 시작 시, 보류 중인 cancel 스케줄 취소
		if (this.pendingCancelTimer) {
			clearTimeout(this.pendingCancelTimer);
			this.pendingCancelTimer = null;
			this.pendingCancelSessionId = null;
		}
		this.lastRequest = request;
		this.currentThreshold = request.threshold;
		if (this.didSendInitialRequest) {
			return false; // 중복 방지
		}
		this.phase = "searching";

		// UI 5분 시작(페이지 이동해도 유지)
		this.startUiTimer(MAX_DURATION_SEC);

		// 연결돼 있으면 즉시 전송, 아니면 connect 때 전송되도록 플래그/큐잉
		if (socketManager.connected) {
			this.didSendInitialRequest = true;
			this.sendOrQueue("matching-request", request);
		} else {
			this.didSendInitialRequest = false;
			this.shouldResendOnConnect = true;
			this.sendOrQueue("matching-request", request);
		}
		return true;
	}

	retryTick(delta: number = 1.5): number {
		if (this.phase !== "searching") return this.currentThreshold ?? 0;
		const base = this.currentThreshold ?? this.lastRequest?.threshold ?? 0;
		this.currentThreshold = base - delta;
		// retry는 드랍되면 체감이 크므로, 연결이 아니면 큐에 넣고 connect 시 flush
		if (!socketManager.connected) {
			this.shouldResendOnConnect = true;
		}
		this.sendOrQueue("matching-retry", { threshold: this.currentThreshold });
		return this.currentThreshold;
	}

	cancel(sessionId?: number): boolean {
		// 세션 불일치면 무시
		if (sessionId && sessionId !== this.currentSessionId) {
			return false;
		}
		// 완료 단계에서는 전송 금지
		if (this.phase === "completing" || this.phase === "completed") {
			return false;
		}
		// 이미 스케줄된 cancel이 있으면 중복 스케줄 금지
		if (this.pendingCancelTimer) {
			return false;
		}
		// 검색/발견 단계에서만 cancel 스케줄
		if (this.phase === "searching" || this.phase === "found") {
			this.stopUi();

			this.pendingCancelSessionId = this.currentSessionId;
			this.pendingCancelTimer = setTimeout(() => {
				// 스케줄 시점과 현재 세션이 같고, 여전히 검색/발견 단계인 경우에만 전송
				const sameSession =
					this.pendingCancelSessionId !== null &&
					this.pendingCancelSessionId === this.currentSessionId;
				if (
					sameSession &&
					(this.phase === "searching" || this.phase === "found")
				) {
					this.sendOrQueue("matching-quit");
					this.phase = "cancelled";
					this.reset();
				}
				this.pendingCancelSessionId = null;
				this.pendingCancelTimer = null;
			}, 400);
			toast.error("화면 이탈로 매칭이 취소되었습니다.");
			return true;
		}
		return false;
	}

	reject(sessionId?: number): void {
		if (sessionId && sessionId !== this.currentSessionId) {
			return;
		}
		// 완료 대기 단계에서만 의미 있음
		if (this.phase === "completing") {
			this.sendOrQueue("matching-reject");
		}
		this.phase = "cancelled";
		this.reset();
	}

	markNotFound(): void {
		this.sendOrQueue("matching-not-found");
		this.phase = "idle";
		this.stopUi();
	}

	confirmFoundReceiver(senderMatchingUuid: string): void {
		this.sendOrQueue("matching-found-success", { senderMatchingUuid });
	}

	completeAsReceiver(senderMatchingUuid: string): void {
		if (this.successReceiverSent) return;
		this.successReceiverSent = true;
		this.sendOrQueue("matching-success-receiver", { senderMatchingUuid });
	}

	completeAsSenderFinal(): void {
		if (this.successFinalSent) return;
		this.successFinalSent = true;
		this.sendOrQueue("matching-success-final");
	}

	fail(): void {
		this.sendOrQueue("matching-fail");
		this.phase = "idle";
		this.stopUi();
	}

	beginCompletePhase(): void {
		// complete 화면으로 넘어가면 플로팅은 꺼도 됨
		this.stopUi();
		this.phase = "completing";
		this.successReceiverSent = false;
		this.successFinalSent = false;
	}

	markSuccess(): void {
		this.phase = "completed";
		this.stopUi();
	}

	getSessionId(): number {
		return this.currentSessionId;
	}

	isMatching(): boolean {
		return this.phase === "searching" || this.phase === "found";
	}
}

export const matchFlow = MatchFlow.getInstance();
