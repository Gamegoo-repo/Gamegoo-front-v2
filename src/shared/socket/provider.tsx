import { useCallback, useEffect, useRef, useState } from "react";
import type { SocketConnection } from "./context";
import { SocketContext } from "./context";
import type { SocketAuthData, SocketOptions } from "./socket";
import { GamegooSocket } from "./socket";
import { SocketReadyState } from "./types";

export interface SocketProviderProps {
	children: React.ReactNode;
	endpoint: string;
	enabled?: boolean;
	tokenProvider?: () => Promise<string>;
	authData?: SocketAuthData;
	options?: SocketOptions;
	onSocketOpen?: () => void;
	onSocketClose?: (reason: string) => void;
	onSocketError?: (error: Error) => void;
	onSocketReconnect?: (attempt: number) => void;
	onSocketReconnectFailed?: () => void;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
	children,
	endpoint,
	enabled = true,
	tokenProvider,
	authData,
	options = {},
	onSocketOpen,
	onSocketClose,
	onSocketError,
	onSocketReconnect,
	onSocketReconnectFailed,
}) => {
	const socketRef = useRef<GamegooSocket | undefined>(undefined);
	const [socketReadyState, setSocketReadyState] = useState<SocketReadyState>(
		SocketReadyState.CLOSED,
	);
	const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);

	const setupSocketListeners = useCallback(
		(socket: GamegooSocket): void => {
			socket.on("connect", () => {
				setSocketReadyState(SocketReadyState.OPEN);
				setReconnectAttempts(0);
				onSocketOpen?.();
			});

			socket.on("disconnect", (reason: string) => {
				setSocketReadyState(SocketReadyState.CLOSED);
				onSocketClose?.(reason);
			});

			socket.on("error", (error: Error) => {
				onSocketError?.(error);
			});

			socket.on("connect_error", (error: Error) => {
				setSocketReadyState(SocketReadyState.CLOSED);
				onSocketError?.(error);
			});

			socket.on("reconnect", (attempt: number) => {
				setSocketReadyState(SocketReadyState.OPEN);
				setReconnectAttempts(0);
				onSocketReconnect?.(attempt);
			});

			socket.on("reconnect_attempt", (attempt: number) => {
				setSocketReadyState(SocketReadyState.CONNECTING);
				setReconnectAttempts(attempt);
			});

			socket.on("reconnect_failed", () => {
				setSocketReadyState(SocketReadyState.CLOSED);
				onSocketReconnectFailed?.();
			});
		},
		[
			onSocketOpen,
			onSocketClose,
			onSocketError,
			onSocketReconnect,
			onSocketReconnectFailed,
		],
	);

	const createSocket = useCallback(async () => {
		if (socketRef.current) {
			socketRef.current.disconnect();
		}

		const socket = new GamegooSocket(endpoint, options, tokenProvider);
		setupSocketListeners(socket);
		socketRef.current = socket;

		try {
			setSocketReadyState(SocketReadyState.CONNECTING);
			await socket.connect(authData);
		} catch (error) {
			setSocketReadyState(SocketReadyState.CLOSED);
			onSocketError?.(error as Error);
		}
	}, [
		endpoint,
		options,
		tokenProvider,
		authData,
		setupSocketListeners,
		onSocketError,
	]);

	const reconnect = useCallback(() => {
		if (socketRef.current) {
			socketRef.current.reconnect();
		} else {
			createSocket();
		}
	}, [createSocket]);

	const disconnect = useCallback(() => {
		if (socketRef.current) {
			socketRef.current.disconnect();
			setSocketReadyState(SocketReadyState.CLOSED);
		}
	}, []);

	const send = useCallback((event: string, data?: unknown) => {
		if (socketRef.current) {
			socketRef.current.send(event, data);
		}
	}, []);

	useEffect(() => {
		if (enabled) {
			createSocket();
		} else {
			disconnect();
		}

		return () => {
			disconnect();
		};
	}, [enabled, createSocket, disconnect]);

	const socketConnection: SocketConnection = {
		socket: socketRef.current,
		socketReadyState,
		reconnect,
		disconnect,
		send,
		isConnected: socketReadyState === SocketReadyState.OPEN,
		reconnectAttempts,
	};

	return (
		<SocketContext.Provider value={socketConnection}>
			{children}
		</SocketContext.Provider>
	);
};
