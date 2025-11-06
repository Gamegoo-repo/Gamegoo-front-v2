import type { SocketAuthData, SocketOptions } from "./socket";
import { GamegooSocket } from "./socket";

type SocketEventCallback = (...args: unknown[]) => void;

class SocketManager {
	private static instance: SocketManager;
	private socket: GamegooSocket | null = null;
	private isConnecting = false;
	private eventCallbacks = new Map<string, Set<SocketEventCallback>>();

	private constructor() {}

	static getInstance(): SocketManager {
		if (!SocketManager.instance) {
			SocketManager.instance = new SocketManager();
		}
		return SocketManager.instance;
	}

	async connect(
		endpoint: string,
		authData?: SocketAuthData,
		options?: SocketOptions,
		tokenProvider?: () => Promise<string>,
	): Promise<void> {
		// 이미 연결되어 있으면 재연결하지 않음
		if (this.socket?.connected) {
			return;
		}

		// 연결 중이면 대기
		if (this.isConnecting) {
			return;
		}

		this.isConnecting = true;

		try {
			// 기존 소켓이 있으면 정리
			if (this.socket) {
				this.socket.disconnect();
				this.socket = null;
			}

			// 새 소켓 생성
			this.socket = new GamegooSocket(endpoint, options, tokenProvider);
			this.setupSocketListeners();

			// 연결 시도
			await this.socket.connect(authData);
		} catch (error) {
			this.socket = null;
			throw error;
		} finally {
			this.isConnecting = false;
		}
	}

	private setupSocketListeners(): void {
		if (!this.socket) return;

		this.socket.on("connect", () => {
			this.emitToCallbacks("connect");
		});

		this.socket.on("disconnect", (reason: string) => {
			this.emitToCallbacks("disconnect", reason);
		});

		this.socket.on("error", (error: Error) => {
			this.emitToCallbacks("error", error);
		});

		this.socket.on("connect_error", (error: Error) => {
			this.emitToCallbacks("connect_error", error);
		});

		this.socket.on("reconnect", (attempt: number) => {
			this.emitToCallbacks("reconnect", attempt);
		});

		this.socket.on("reconnect_attempt", (attempt: number) => {
			this.emitToCallbacks("reconnect_attempt", attempt);
		});

		this.socket.on("reconnect_failed", () => {
			this.emitToCallbacks("reconnect_failed");
		});
	}

	private emitToCallbacks(event: string, ...args: unknown[]): void {
		const callbacks = this.eventCallbacks.get(event);
		if (callbacks) {
			callbacks.forEach((callback) => {
				try {
					callback(...args);
				} catch (error) {
					console.error(`소켓 이벤트 콜백 에러 (${event}):`, error);
				}
			});
		}
	}

	on(event: string, callback: SocketEventCallback): void {
		if (!this.eventCallbacks.has(event)) {
			this.eventCallbacks.set(event, new Set());
		}
		this.eventCallbacks.get(event)?.add(callback);

		if (
			this.socket?.socket &&
			![
				"connect",
				"disconnect",
				"error",
				"connect_error",
				"reconnect",
				"reconnect_attempt",
				"reconnect_failed",
			].includes(event)
		) {
			this.socket.socket.on(event, callback);
		}
	}

	off(event: string, callback?: SocketEventCallback): void {
		if (callback) {
			const callbacks = this.eventCallbacks.get(event);
			if (callbacks) {
				callbacks.delete(callback);
				if (callbacks.size === 0) {
					this.eventCallbacks.delete(event);
				}
			}

			if (this.socket?.socket) {
				this.socket.socket.off(event, callback);
			}
		} else {
			this.eventCallbacks.delete(event);

			if (this.socket?.socket) {
				this.socket.socket.off(event);
			}
		}
	}

	send(event: string, data?: unknown): void {
		if (this.socket?.connected) {
			this.socket.send(event, data);
		} else {
			console.warn(
				`소켓이 연결되지 않아 ${event} 이벤트를 전송할 수 없습니다.`,
			);
		}
	}

	disconnect(): void {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
		this.isConnecting = false;
	}

	reconnect(): void {
		if (this.socket) {
			this.socket.reconnect();
		}
	}

	get connected(): boolean {
		return this.socket?.connected || false;
	}

	get readyState() {
		return this.socket?.readyState;
	}

	get reconnectAttemptCount(): number {
		return this.socket?.reconnectAttemptCount || 0;
	}

	get socketInstance(): GamegooSocket | null {
		return this.socket;
	}
}

export const socketManager = SocketManager.getInstance();
