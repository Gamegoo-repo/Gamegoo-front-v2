import { socketManager } from "@/shared/api/socket";
import type {
	MatchingCountData,
	MatchingFoundReceiverEvent,
	MatchingFoundSenderEvent,
	MatchingRequest,
} from "./matching-types";

type MatchEventName =
	| "matching-started"
	| "matching-count"
	| "matching-found-sender"
	| "matching-found-receiver"
	| "matching-not-found"
	| "matching-fail"
	| "matching-success"
	| "matching-success-sender"
	| "jwt-expired-error"
	| "connect";

type MatchEventPayloadMap = {
	"matching-started": unknown;
	"matching-count": MatchingCountData;
	"matching-found-sender": MatchingFoundSenderEvent;
	"matching-found-receiver": MatchingFoundReceiverEvent;
	"matching-not-found": undefined;
	"matching-fail": undefined;
	"matching-success": unknown;
	"matching-success-sender": unknown;
	"jwt-expired-error": undefined;
	connect: undefined;
};

type Listener<K extends MatchEventName> = (
	payload: MatchEventPayloadMap[K],
) => void;

/**
 * MatchEventManager
 * - 매칭 관련 이벤트를 중앙에서 관리하는 경량 이벤트 매니저
 * - socketManager에 대한 직접 의존을 줄이고, 타입 안정성을 높입니다.
 */
class MatchEventManager {
	private static instance: MatchEventManager;
	private listeners = new Map<MatchEventName, Set<Listener<any>>>();
	private isBoundToSocket = false;

	private constructor() {}

	static getInstance(): MatchEventManager {
		if (!MatchEventManager.instance) {
			MatchEventManager.instance = new MatchEventManager();
		}
		return MatchEventManager.instance;
	}

	/**
	 * 소켓 이벤트를 MatchEventManager에 바인딩합니다.
	 * 여러 번 호출되더라도 한 번만 바인딩되도록 보호합니다.
	 */
	bindSocketEvents(): void {
		if (this.isBoundToSocket) return;
		this.isBoundToSocket = true;

		const forward =
			<E extends MatchEventName>(event: E) =>
			(...args: unknown[]) => {
				// 서버에서 오는 이벤트 페이로드를 그대로 전달
				// 필요한 경우 여기서 스키마 정제/검증 가능
				this.emit(event, args[0] as MatchEventPayloadMap[E]);
			};

		socketManager.on("matching-started", forward("matching-started"));
		socketManager.on("matching-count", forward("matching-count"));
		socketManager.on("matching-found-sender", forward("matching-found-sender"));
		socketManager.on(
			"matching-found-receiver",
			forward("matching-found-receiver"),
		);
		socketManager.on("matching-not-found", forward("matching-not-found"));
		socketManager.on("matching-fail", forward("matching-fail"));
		socketManager.on("matching-success", forward("matching-success"));
		socketManager.on(
			"matching-success-sender",
			forward("matching-success-sender"),
		);
		socketManager.on("jwt-expired-error", forward("jwt-expired-error"));
		socketManager.on("connect", forward("connect"));
	}

	on<K extends MatchEventName>(event: K, listener: Listener<K>): () => void {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new Set());
		}
		this.listeners.get(event)?.add(listener as Listener<any>);
		// 구독 시점에 소켓 바인딩이 보장되도록
		this.bindSocketEvents();
		return () => this.off(event, listener);
	}

	off<K extends MatchEventName>(event: K, listener?: Listener<K>): void {
		if (!listener) {
			this.listeners.delete(event);
			return;
		}
		const set = this.listeners.get(event);
		if (!set) return;
		set.delete(listener as Listener<any>);
		if (set.size === 0) {
			this.listeners.delete(event);
		}
	}

	private emit<K extends MatchEventName>(
		event: K,
		payload: MatchEventPayloadMap[K],
	): void {
		const set = this.listeners.get(event);
		if (!set || set.size === 0) return;
		for (const listener of set) {
			try {
				(listener as Listener<K>)(payload);
			} catch (e) {
				console.error(`[MatchEventManager] listener error on ${event}:`, e);
			}
		}
	}

	// === Outgoing (emit to server) helpers - 타입 보조 메서드 ===
	sendMatchingRequest(request: MatchingRequest & { memberId?: number }): void {
		socketManager.send("matching-request", request);
	}

	sendMatchingRetry(threshold: number): void {
		socketManager.send("matching-retry", { threshold });
	}

	sendMatchingFoundSuccess(senderMatchingUuid: string): void {
		socketManager.send("matching-found-success", { senderMatchingUuid });
	}

	sendMatchingSuccessReceiver(senderMatchingUuid: string): void {
		socketManager.send("matching-success-receiver", { senderMatchingUuid });
	}

	sendMatchingSuccessFinal(): void {
		socketManager.send("matching-success-final");
	}

	sendMatchingFail(): void {
		socketManager.send("matching-fail");
	}

	sendMatchingQuit(): void {
		socketManager.send("matching-quit");
	}

	sendMatchingReject(): void {
		socketManager.send("matching-reject");
	}

	sendMatchingNotFound(): void {
		socketManager.send("matching-not-found");
	}
}

export const matchEventManager = MatchEventManager.getInstance();
