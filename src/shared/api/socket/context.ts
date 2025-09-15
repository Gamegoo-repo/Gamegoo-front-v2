import { createContext } from "react";
import type { GamegooSocket } from "./socket";
import { SocketReadyState } from "./types";

export interface SocketConnection {
	socket?: GamegooSocket;
	socketReadyState: SocketReadyState;
	reconnect: () => void;
	disconnect: () => void;
	send: (event: string, data?: unknown) => void;
	isConnected: boolean;
	reconnectAttempts: number;
}

export interface ProviderContext {
	socketConnection: SocketConnection;
}

export const createSocketContext = () => {
	return createContext<SocketConnection>({
		socket: undefined,
		socketReadyState: SocketReadyState.CLOSED,
		reconnect: () => {},
		disconnect: () => {},
		send: () => {},
		isConnected: false,
		reconnectAttempts: 0,
	});
};

export const SocketContext = createSocketContext();
