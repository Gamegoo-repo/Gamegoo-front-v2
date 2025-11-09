import { useCallback, useEffect, useRef, useState } from "react";
import type { SocketConnection } from "./context";
import { SocketContext } from "./context";
import type { SocketAuthData, SocketOptions } from "./socket";
import { socketManager } from "./socket-manager";
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

function SocketProvider({
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
}: SocketProviderProps) {
	const [socketReadyState, setSocketReadyState] = useState<SocketReadyState>(
		SocketReadyState.CLOSED,
	);
	const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);

	// 싱글톤 소켓 매니저의 이벤트 리스너 설정
	const setupSocketListeners = useCallback(() => {

		const handleConnect = (..._args: unknown[]) => {
			console.log("🔥 handleConnect 호출됨 - 상태 업데이트 중...");
			setSocketReadyState(SocketReadyState.OPEN);
			setReconnectAttempts(0);
			console.log("🔥 SocketReadyState.OPEN으로 설정됨");
			onSocketOpen?.();
		};

		const handleDisconnect = (...args: unknown[]) => {
			setSocketReadyState(SocketReadyState.CLOSED);
			onSocketClose?.(args[0] as string);
		};

		const handleError = (...args: unknown[]) => {
			onSocketError?.(args[0] as Error);
		};

		const handleConnectError = (...args: unknown[]) => {
			setSocketReadyState(SocketReadyState.CLOSED);
			onSocketError?.(args[0] as Error);
		};

		const handleReconnect = (...args: unknown[]) => {
			setSocketReadyState(SocketReadyState.OPEN);
			setReconnectAttempts(0);
			onSocketReconnect?.(args[0] as number);
		};

		const handleReconnectAttempt = (...args: unknown[]) => {
			setSocketReadyState(SocketReadyState.CONNECTING);
			setReconnectAttempts(args[0] as number);
		};

		const handleReconnectFailed = (..._args: unknown[]) => {
			setSocketReadyState(SocketReadyState.CLOSED);
			onSocketReconnectFailed?.();
		};

		// 이벤트 리스너 등록
		socketManager.on("connect", handleConnect);
		socketManager.on("disconnect", handleDisconnect);
		socketManager.on("error", handleError);
		socketManager.on("connect_error", handleConnectError);
		socketManager.on("reconnect", handleReconnect);
		socketManager.on("reconnect_attempt", handleReconnectAttempt);
		socketManager.on("reconnect_failed", handleReconnectFailed);

		// 클린업 함수 반환
		return () => {
			socketManager.off("connect", handleConnect);
			socketManager.off("disconnect", handleDisconnect);
			socketManager.off("error", handleError);
			socketManager.off("connect_error", handleConnectError);
			socketManager.off("reconnect", handleReconnect);
			socketManager.off("reconnect_attempt", handleReconnectAttempt);
			socketManager.off("reconnect_failed", handleReconnectFailed);
		};
	}, [
		onSocketOpen,
		onSocketClose,
		onSocketError,
		onSocketReconnect,
		onSocketReconnectFailed,
	]);

	const createSocket = useCallback(async () => {
		try {
			console.log("🔄 createSocket 호출됨:", {
				endpoint,
				hasAuthData: !!authData,
				authDataUserId: authData?.userId,
				hasTokenProvider: !!tokenProvider,
				timestamp: new Date().toISOString(),
			});
			
			setSocketReadyState(SocketReadyState.CONNECTING);
			await socketManager.connect(endpoint, authData, options, tokenProvider);
			
			console.log("✅ socketManager.connect 완료");
		} catch (error) {
			console.error("❌ createSocket 에러:", error);
			setSocketReadyState(SocketReadyState.CLOSED);
			if (error instanceof Error) {
				onSocketError?.(error);
			} else {
				onSocketError?.(new Error(String(error)));
			}
		}
	}, [endpoint, authData, options, tokenProvider, onSocketError]);

	const reconnect = useCallback(() => {
		if (socketManager.connected) {
			socketManager.reconnect();
		} else {
			createSocket();
		}
	}, [createSocket]);

	const disconnect = useCallback(() => {
		console.log("📞 Provider에서 disconnect 호출됨");
		socketManager.disconnect();
		setSocketReadyState(SocketReadyState.CLOSED);
	}, []);

	const send = useCallback((event: string, data?: unknown) => {
		socketManager.send(event, data);
	}, []);

	// 이벤트 리스너는 한 번만 설정
	useEffect(() => {
		const cleanup = setupSocketListeners();
		return cleanup;
	}, [setupSocketListeners]);

	// enabled 변경시에만 소켓 연결/해제
	const enabledRef = useRef(enabled);
	enabledRef.current = enabled;

	useEffect(() => {
		console.log("🔌 SocketProvider enabled 상태 변경:", {
			enabled,
			endpoint,
			hasAuthData: !!authData,
			authDataToken: authData?.token ? `${authData.token.substring(0, 10)}...` : "없음",
			authDataUserId: authData?.userId,
			timestamp: new Date().toISOString(),
		});

		if (enabled) {
			console.log("🚀 소켓 연결 시작...");
			createSocket();
		} else {
			console.log("🔌 enabled=false로 인한 disconnect");
			socketManager.disconnect();
			setSocketReadyState(SocketReadyState.CLOSED);
		}
	}, [enabled, createSocket]);

	// 초기 연결 상태 동기화
	useEffect(() => {
		if (socketManager.connected) {
			setSocketReadyState(SocketReadyState.OPEN);
		}
	}, []);

	const isConnected = socketReadyState === SocketReadyState.OPEN;
	
	// 🔍 디버깅: 연결 상태 변화 감지
	useEffect(() => {
		console.log("🔥 SocketProvider 상태 변화:", {
			socketReadyState,
			isConnected,
			socketManagerConnected: socketManager.connected,
			timestamp: new Date().toISOString(),
		});
	}, [socketReadyState, isConnected]);

	const socketConnection: SocketConnection = {
		socket: socketManager.socketInstance ?? undefined,
		socketReadyState,
		reconnect,
		disconnect,
		send,
		isConnected,
		reconnectAttempts,
	};

	return (
		<SocketContext.Provider value={socketConnection}>
			{children}
		</SocketContext.Provider>
	);
}

export default SocketProvider;
