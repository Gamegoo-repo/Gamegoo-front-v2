import { io, type Socket } from "socket.io-client";
import { SocketReadyState } from "./types";

export interface SocketOptions {
	maxReconnectAttempts?: number;
	reconnectDelay?: number;
	heartbeatInterval?: number;
	heartbeatTimeout?: number;
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
		console.log("🎯 GamegooSocket.connect 호출됨:", {
			endpoint: this.endpoint,
			hasExistingSocket: !!this.socket,
			isSocketConnected: this.socket?.connected,
			hasAuthData: !!authData,
			authDataUserId: authData?.userId,
			hasTokenProvider: !!this.tokenProvider,
			timestamp: new Date().toISOString(),
		});

		if (this.socket?.connected) {
			console.log("⚠️ GamegooSocket 이미 연결됨 - 연결 시도 건너뜀");
			return;
		}

		if (authData) {
			this.authData = authData;
			console.log("🔑 authData 설정됨:", { userId: authData.userId, hasToken: !!authData.token });
		} else if (this.tokenProvider) {
			try {
				console.log("🔄 tokenProvider에서 토큰 가져오는 중...");
				const token = await this.tokenProvider();
				this.authData = { token, userId: "auto" }; // TODO: 실제 userId로 수정
				console.log("✅ tokenProvider에서 토큰 획득 성공");
			} catch (error) {
				console.error("❌ tokenProvider에서 토큰 획득 실패:", error);
				throw new Error("Failed to get auth token");
			}
		}

		if (!this.authData) {
			console.error("❌ 인증 데이터 없음");
			throw new Error("No authentication data provided");
		}

		console.log("🔧 소켓 생성 준비:", {
			endpoint: this.endpoint,
			authUserId: this.authData.userId,
			hasToken: !!this.authData.token,
		});

		this.isManualDisconnect = false;
		this.createSocket();
	}

	private createSocket(): void {
		if (this.socket) {
			console.log("🧹 기존 소켓 정리 중...");
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

		console.log("🚀 Socket.IO 인스턴스 생성:", {
			endpoint: this.endpoint,
			auth: {
				hasToken: !!socketConfig.auth.token,
				tokenPrefix: socketConfig.auth.token?.substring(0, 10) + "...",
				userId: socketConfig.auth.userId,
			},
			options: {
				reconnectionAttempts: socketConfig.reconnectionAttempts,
				reconnectionDelay: socketConfig.reconnectionDelay,
				timeout: socketConfig.timeout,
				transports: socketConfig.transports,
			},
		});

		this.socket = io(this.endpoint, socketConfig);

		this.setupEventHandlers();
		
		console.log("🔌 소켓 연결 시작...");
		this.socket.connect();
	}

	private setupEventHandlers(): void {
		if (!this.socket) return;

		this.socket.on("connect", () => {
			console.log("✅ Socket.IO 연결 성공!", {
				socketId: this.socket?.id,
				endpoint: this.endpoint,
				timestamp: new Date().toISOString(),
			});
			this.reconnectAttempts = 0;
			this.startHeartbeat();
			this.emit("connect");
		});

		this.socket.on("disconnect", (reason: string) => {
			console.log("🔴 Socket.IO 연결 해제:", {
				reason,
				isManualDisconnect: this.isManualDisconnect,
				endpoint: this.endpoint,
				timestamp: new Date().toISOString(),
			});
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
		const errorMessage = error.message.toLowerCase();

		if (errorMessage.includes("unauthorized") || errorMessage.includes("401")) {
			await this.handleTokenExpiry();
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
