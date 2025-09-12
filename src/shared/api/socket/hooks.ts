import { useCallback, useContext, useEffect, useRef } from "react";

import { SocketContext } from "./context";
import { getSocketStateLabel, SocketReadyState } from "./types";

export const useSocket = () => {
	const context = useContext(SocketContext);

	if (!context) {
		throw new Error("useSocket must be used within a SocketProvider");
	}

	return context;
};

export const useSocketConnection = () => {
	const { socket, isConnected, socketReadyState, reconnectAttempts } =
		useSocket();

	return {
		socket,
		isConnected,
		socketReadyState,
		reconnectAttempts,
	};
};

export const useSocketControls = () => {
	const { reconnect, disconnect, send } = useSocket();

	return {
		reconnect,
		disconnect,
		send,
	};
};

export const useSocketEvent = <T = unknown>(
	event: string,
	handler: (data: T) => void,
) => {
	const { socket } = useSocket();
	const handlerRef = useRef(handler);

	// Update handler ref when handler changes
	useEffect(() => {
		handlerRef.current = handler;
	}, [handler]);

	useEffect(() => {
		if (!socket) return;

		const eventHandler = (...args: unknown[]) => {
			handlerRef.current(args[0] as T);
		};

		// Register custom event listener on the GamegooSocket instance
		socket.on(event, eventHandler);

		return () => {
			socket.off(event, eventHandler);
		};
	}, [socket, event]);
};

export const useSocketMessage = <T = unknown>(
	event: string,
	handler: (data: T) => void,
) => {
	const { socket } = useSocket();
	const handlerRef = useRef(handler);

	useEffect(() => {
		handlerRef.current = handler;
	}, [handler]);

	useEffect(() => {
		if (!socket?.socket) return;

		const eventHandler = (data: T) => {
			handlerRef.current(data);
		};

		// Register listener on the actual socket.io instance
		socket.socket.on(event, eventHandler);

		return () => {
			socket.socket?.off(event, eventHandler);
		};
	}, [socket?.socket, event]);
};

export const useSocketConnectionEvents = (callbacks: {
	onConnect?: () => void;
	onDisconnect?: (reason: string) => void;
	onError?: (error: Error) => void;
	onReconnect?: (attempt: number) => void;
	onReconnectFailed?: () => void;
}) => {
	const noop = useCallback(() => {}, []);

	useSocketEvent("connect", callbacks.onConnect || noop);
	useSocketEvent("disconnect", callbacks.onDisconnect || noop);
	useSocketEvent("error", callbacks.onError || noop);
	useSocketEvent("reconnect", callbacks.onReconnect || noop);
	useSocketEvent("reconnect_failed", callbacks.onReconnectFailed || noop);
};

export const useSocketSend = () => {
	const { send, isConnected } = useSocket();

	const safeSend = useCallback(
		(event: string, data?: unknown) => {
			if (!isConnected) {
				console.warn(`Cannot send ${event}: socket not connected`);
				return false;
			}

			try {
				send(event, data);
				return true;
			} catch (error) {
				console.error(`Failed to send ${event}:`, error);
				return false;
			}
		},
		[send, isConnected],
	);

	return {
		send: safeSend,
		isConnected,
	};
};

export const useSocketStatus = () => {
	const { socketReadyState, isConnected, reconnectAttempts } = useSocket();

	return {
		readyState: socketReadyState,
		stateLabel: getSocketStateLabel(socketReadyState),
		isConnecting: socketReadyState === SocketReadyState.CONNECTING,
		isOpen: socketReadyState === SocketReadyState.OPEN,
		isClosing: socketReadyState === SocketReadyState.CLOSING,
		isClosed: socketReadyState === SocketReadyState.CLOSED,
		isConnected,
		reconnectAttempts,
	};
};
