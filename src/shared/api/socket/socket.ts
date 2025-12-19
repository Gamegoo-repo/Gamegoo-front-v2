import { io, type Socket } from "socket.io-client";
import { SocketReadyState } from "./types";

export interface SocketOptions {
	maxReconnectAttempts?: number;
	reconnectDelay?: number;
	heartbeatInterval?: number;
	heartbeatTimeout?: number;
}

interface SocketIOError extends Error {
	type?: string;
	description?: {
		status?: number;
		statusText?: string;
		[key: string]: any;
	};
	context?: any;
}

export interface SocketAuthData {
	token: string;
	userId: string;
}

export interface SocketEventMap {
	connect: () => void;
	disconnect: (reason: string) => void;
	error: (error: Error) => void;
	connect_error: (error: Error) => void;
	reconnect: (attempt: number) => void;
	reconnect_attempt: (attempt: number) => void;
	reconnect_error: (error: Error) => void;
	reconnect_failed: () => void;
	ping: () => void;
	pong: (latency: number) => void;
}

export class GamegooSocket {
	public socket: Socket | null = null;
	private options: Required<SocketOptions>;
	private authData: SocketAuthData | null = null;
	private tokenProvider: (() => Promise<string>) | null = null;
	private isManualDisconnect = false;
	private heartbeatIntervalId: ReturnType<typeof setInterval> | null = null;
	private heartbeatTimeoutId: ReturnType<typeof setInterval> | null = null;
	private reconnectAttempts = 0;
	private eventListeners = new Map<string, ((...args: unknown[]) => void)[]>();
	private jwtRetryMap = new Map<string, number>(); // 이벤트별 재시도 횟수
	private readonly MAX_JWT_RETRY = 3; // 최대 3번까지 재시도

	constructor(
		private endpoint: string,
		options: SocketOptions = {},
		tokenProvider?: () => Promise<string>,
	) {
		this.options = {
			maxReconnectAttempts: 5,
			reconnectDelay: 3000,
			heartbeatInterval: 30000,
			heartbeatTimeout: 5000,
			...options,
		};
		this.tokenProvider = tokenProvider || null;
	}

	async connect(authData?: SocketAuthData): Promise<void> {
		if (this.socket?.connected) {
			return;
		}

		if (authData) {
			this.authData = authData;
		} else if (this.tokenProvider) {
			try {
				const token = await this.tokenProvider();
				this.authData = { token, userId: "auto" }; // TODO: 실제 userId로 수정
			} catch (_error) {
				throw new Error("Failed to get auth token");
			}
		}

		if (!this.authData) {
			console.error("❌ 인증 데이터 없음");
			throw new Error("No authentication data provided");
		}

		this.isManualDisconnect = false;
		this.createSocket();
	}

	private createSocket(): void {
		if (this.socket) {
			this.socket.disconnect();
		}

		const socketConfig = {
			auth: {
				token: this.authData?.token,
				userId: this.authData?.userId,
			},
			autoConnect: false,
			reconnection: true,
			reconnectionAttempts: this.options.maxReconnectAttempts,
			reconnectionDelay: this.options.reconnectDelay,
			timeout: 20000,
			transports: ["websocket"],
		};

		this.socket = io(this.endpoint, socketConfig);

		this.setupEventHandlers();

		this.socket.connect();
	}

	private setupEventHandlers(): void {
		if (!this.socket) return;

		this.socket.on("connect", () => {
			this.reconnectAttempts = 0;
			this.startHeartbeat();
			this.emit("connect");
		});

		this.socket.on("jwt-expired-error", this.handleJwtExpired.bind(this));

		this.socket.on("disconnect", (reason: string) => {
			this.stopHeartbeat();
			this.emit("disconnect", reason);

			if (!this.isManualDisconnect && reason === "io server disconnect") {
				this.handleServerDisconnect();
			}
		});

		this.socket.on("connect_error", (error: Error) => {
			console.error("❌ Socket.IO 연결 에러:", {
				error: error.message,
				endpoint: this.endpoint,
				reconnectAttempts: this.reconnectAttempts,
				timestamp: new Date().toISOString(),
			});
			this.emit("connect_error", error);
			this.handleConnectionError(error);
		});

		this.socket.on("reconnect", (attempt: number) => {
			this.emit("reconnect", attempt);
		});

		this.socket.on("reconnect_attempt", (attempt: number) => {
			this.reconnectAttempts = attempt;
			this.emit("reconnect_attempt", attempt);
		});

		this.socket.on("reconnect_error", (error: Error) => {
			this.emit("reconnect_error", error);
		});

		this.socket.on("reconnect_failed", () => {
			this.emit("reconnect_failed");
		});

		this.socket.on("pong", (latency: number) => {
			this.clearHeartbeatTimeout();
			this.emit("pong", latency);
		});
	}

	private async handleConnectionError(error: Error): Promise<void> {
		const socketError = error as SocketIOError;

		if (socketError.description?.status === 401) {
			await this.handleConnectionJwtError();
		}
	}
	/**
	 * connection-jwt-error 수신 → 토큰 갱신 → connection-update-token emit
	 */
	private async handleConnectionJwtError(): Promise<void> {
		if (!this.tokenProvider) return;

		try {
			// 1. 새 토큰 발급
			const newToken = await this.tokenProvider();

			// 2. authData 업데이트
			if (this.authData) {
				this.authData.token = newToken;
			}

			// 3. 서버에 connection-update-token 이벤트 전송
			if (this.socket?.connected) {
				this.socket.emit("connection-update-token", { token: newToken });
			}
		} catch (error) {
			console.error("❌ connection-jwt-error 처리 실패:", error);
			this.emit("error", new Error("Failed to handle connection JWT error"));
		}
	}

	private async handleServerDisconnect(): Promise<void> {
		if (this.tokenProvider) {
			await this.handleTokenExpiry();
		} else {
			this.reconnect();
		}
	}

	private async handleTokenExpiry(): Promise<void> {
		if (!this.tokenProvider) return;

		try {
			const newToken = await this.tokenProvider();
			if (this.authData) {
				this.authData.token = newToken;
			}
			this.reconnect();
		} catch (_error) {
			this.emit("error", new Error("Failed to refresh token"));
		}
	}

	// JWT 만료 시 실패한 이벤트 재전송 처리
	private async handleJwtExpired(...args: unknown[]): Promise<void> {
		const errorData = args[0] as {
			event: string;
			data: {
				eventName: string;
				eventData: unknown;
			};
			timestamp: string;
		};

		const eventName = errorData?.data?.eventName;

		if (!eventName) {
			console.error("❌ eventName이 없습니다");
			return;
		}

		// 재시도 횟수 확인
		const retryCount = this.jwtRetryMap.get(eventName) || 0;
		if (retryCount >= this.MAX_JWT_RETRY) {
			this.jwtRetryMap.delete(eventName);
			return;
		}

		// 재시도 횟수 증가
		this.jwtRetryMap.set(eventName, retryCount + 1);

		try {
			// 토큰 갱신 (tokenProvider 사용)
			if (!this.tokenProvider) {
				console.error("❌ tokenProvider가 없습니다");
				return;
			}

			const newToken = await this.tokenProvider();

			if (!newToken) {
				console.error("❌ 토큰 갱신 실패");
				return;
			}

			// authData 업데이트
			if (this.authData) {
				this.authData.token = newToken;
			}

			// 실패한 이벤트에 새 토큰을 포함하여 재전송
			const canRetry =
				this.socket?.connected &&
				errorData?.data?.eventName &&
				errorData?.data?.eventData;

			if (canRetry) {
				// 원본 이벤트 데이터에 새 토큰을 추가
				const eventDataWithToken = {
					...(errorData.data.eventData as Record<string, unknown>),
					token: newToken, // 토큰
				};

				this.send(errorData.data.eventName, eventDataWithToken);

				this.jwtRetryMap.delete(eventName);
			} else {
				console.warn("⚠️ 재전송 조건 미충족, 재전송 스킵");
			}
		} catch (error) {
			console.error("❌ jwt-expired-error 처리 실패:", error);
		}
	}

	private startHeartbeat(): void {
		this.stopHeartbeat();

		// heartbeat 비활성화 (interval이 0이면 건너뛰기)
		if (this.options.heartbeatInterval <= 0) {
			return;
		}

		this.heartbeatIntervalId = setInterval(() => {
			if (this.socket?.connected) {
				this.socket.emit("ping");
				this.setHeartbeatTimeout();
			}
		}, this.options.heartbeatInterval);
	}

	private setHeartbeatTimeout(): void {
		this.heartbeatTimeoutId = setTimeout(() => {
			this.emit("error", new Error("Heartbeat timeout"));
			this.reconnect();
		}, this.options.heartbeatTimeout);
	}

	private clearHeartbeatTimeout(): void {
		if (this.heartbeatTimeoutId) {
			clearTimeout(this.heartbeatTimeoutId);
			this.heartbeatTimeoutId = null;
		}
	}

	private stopHeartbeat(): void {
		if (this.heartbeatIntervalId) {
			clearInterval(this.heartbeatIntervalId);
			this.heartbeatIntervalId = null;
		}
		this.clearHeartbeatTimeout();
	}

	reconnect(): void {
		if (this.socket) {
			this.socket.disconnect();
		}
		setTimeout(() => {
			this.createSocket();
		}, this.options.reconnectDelay);
	}

	disconnect(): void {
		this.isManualDisconnect = true;
		this.stopHeartbeat();

		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
	}

	emit(event: string, ...args: unknown[]): void {
		const listeners = this.eventListeners.get(event) || [];
		listeners.forEach((listener) => {
			try {
				listener(...args);
			} catch (error) {
				console.error(`Error in socket event listener for ${event}:`, error);
			}
		});
	}

	on<K extends keyof SocketEventMap>(
		event: K,
		listener: SocketEventMap[K],
	): void;
	on(event: string, listener: (...args: unknown[]) => void): void;
	on(event: string, listener: (...args: unknown[]) => void): void {
		if (!this.eventListeners.has(event)) {
			this.eventListeners.set(event, []);
		}
		this.eventListeners.get(event)?.push(listener);
	}

	off<K extends keyof SocketEventMap>(
		event: K,
		listener?: SocketEventMap[K],
	): void;
	off(event: string, listener?: (...args: unknown[]) => void): void;
	off(event: string, listener?: (...args: unknown[]) => void): void {
		if (!listener) {
			this.eventListeners.delete(event);
			return;
		}

		const listeners = this.eventListeners.get(event);
		if (listeners) {
			const index = listeners.indexOf(listener);
			if (index > -1) {
				listeners.splice(index, 1);
			}
		}
	}

	send(event: string, data?: unknown): void {
		if (this.socket?.connected) {
			this.socket.emit(event, data);
		} else {
			throw new Error("Socket is not connected");
		}
	}

	get connected(): boolean {
		return this.socket?.connected || false;
	}

	get readyState(): SocketReadyState {
		if (!this.socket) return SocketReadyState.CLOSED;
		if (this.socket.connected) return SocketReadyState.OPEN;
		if (this.socket.disconnected) return SocketReadyState.CLOSED;
		return SocketReadyState.CONNECTING;
	}

	get reconnectAttemptCount(): number {
		return this.reconnectAttempts;
	}
}
