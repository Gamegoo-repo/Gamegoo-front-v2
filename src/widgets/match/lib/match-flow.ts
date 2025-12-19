import { socketManager } from "@/shared/api/socket";
import { toast } from "@/shared/lib/toast";
import type {
	MatchEventName,
	MatchEventPayloadMap,
} from "./match-event-manager";
import { matchEventManager } from "./match-event-manager";
import type { MatchingRequest } from "./matching-types";

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

	static getInstance(): MatchFlow {
		if (!MatchFlow.instance) {
			MatchFlow.instance = new MatchFlow();
		}
		return MatchFlow.instance;
	}

	// === Lifecycle / wiring ===
	private ensureSocketBinding(): void {
		if (this.isSocketBound) return;
		this.isSocketBound = true;

		const forward =
			<E extends MatchEventName>(event: E) =>
			(...args: unknown[]) => {
				if (event === "connect") {
					this.handleConnect();
				} else if (event === "jwt-expired-error") {
					this.onJwtExpired();
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
		if (!this.lastRequest) return;
		// 연결 직후: 초기 전송을 안 했으면 최초 요청 전송
		if (!this.didSendInitialRequest) {
			this.didSendInitialRequest = true;
			const threshold =
				this.currentThreshold ?? this.lastRequest.threshold ?? 0;
			socketManager.send("matching-request", {
				...this.lastRequest,
				threshold,
			});
			return;
		}
		// JWT 만료 등으로 재전송 플래그가 켜진 경우에만 재전송
		if (this.shouldResendOnConnect) {
			this.shouldResendOnConnect = false;
			const threshold =
				this.currentThreshold ?? this.lastRequest.threshold ?? 0;
			socketManager.send("matching-request", {
				...this.lastRequest,
				threshold,
			});
		}
	}

	onJwtExpired(): void {
		this.shouldResendOnConnect = true;
		this.didSendInitialRequest = false;
	}

	reset(): void {
		this.didSendInitialRequest = false;
		this.shouldResendOnConnect = false;
		this.lastRequest = null;
		this.currentThreshold = null;
		this.phase = "idle";
		this.successReceiverSent = false;
		this.successFinalSent = false;
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
		this.didSendInitialRequest = true;
		this.phase = "searching";
		socketManager.send("matching-request", request);
		return true;
	}

	retryTick(delta: number = 1.5): number {
		if (this.phase !== "searching") return this.currentThreshold ?? 0;
		const base = this.currentThreshold ?? this.lastRequest?.threshold ?? 0;
		this.currentThreshold = base - delta;
		socketManager.send("matching-retry", { threshold: this.currentThreshold });
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
					socketManager.send("matching-quit");
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
			socketManager.send("matching-reject");
		}
		this.phase = "cancelled";
		this.reset();
	}

	markNotFound(): void {
		socketManager.send("matching-not-found");
		this.phase = "idle";
	}

	confirmFoundReceiver(senderMatchingUuid: string): void {
		socketManager.send("matching-found-success", { senderMatchingUuid });
	}

	completeAsReceiver(senderMatchingUuid: string): void {
		if (this.successReceiverSent) return;
		this.successReceiverSent = true;
		socketManager.send("matching-success-receiver", { senderMatchingUuid });
	}

	completeAsSenderFinal(): void {
		if (this.successFinalSent) return;
		this.successFinalSent = true;
		socketManager.send("matching-success-final");
	}

	fail(): void {
		socketManager.send("matching-fail");
		this.phase = "idle";
	}

	beginCompletePhase(): void {
		this.phase = "completing";
		this.successReceiverSent = false;
		this.successFinalSent = false;
	}

	markSuccess(): void {
		this.phase = "completed";
	}

	getSessionId(): number {
		return this.currentSessionId;
	}
}

export const matchFlow = MatchFlow.getInstance();
