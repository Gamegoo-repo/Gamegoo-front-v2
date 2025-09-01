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
	private heartbeatIntervalId: NodeJS.Timeout | null = null;
	private heartbeatTimeoutId: NodeJS.Timeout | null = null;
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
		if (this.socket?.connected) {
			return;
		}

		if (authData) {
			this.authData = authData;
		} else if (this.tokenProvider) {
			try {
				const token = await this.tokenProvider();
				this.authData = { token, userId: "auto" };
			} catch (_error) {
				throw new Error("Failed to get auth token");
			}
		}

		if (!this.authData) {
			throw new Error("No authentication data provided");
		}

		this.isManualDisconnect = false;
		this.createSocket();
	}

	private createSocket(): void {
		if (this.socket) {
			this.socket.disconnect();
		}

		this.socket = io(this.endpoint, {
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
		});

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

		this.socket.on("disconnect", (reason: string) => {
			this.stopHeartbeat();
			this.emit("disconnect", reason);

			if (!this.isManualDisconnect && reason === "io server disconnect") {
				this.handleServerDisconnect();
			}
		});

		this.socket.on("connect_error", (error: Error) => {
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
