import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { tokenManager } from "@/shared/api";
import { socketManager } from "@/shared/api/socket/socket-manager";
import { useAuth } from "@/shared/model/use-auth";

interface GamegooSocketContextType {
	isAuthenticated: boolean;
	isConnected: boolean;
}

const GamegooSocketContext = createContext<GamegooSocketContextType | null>(
	null,
);

interface GamegooSocketProviderProps {
	children: ReactNode;
}

export function GamegooSocketProvider({
	children,
}: GamegooSocketProviderProps) {
	const SOCKET_ENDPOINT = process.env.PUBLIC_SOCKET_URL || "";
	const { user: authUser, isAuthenticated } = useAuth();
	const [isConnected, setIsConnected] = useState(false);
	const hasConnectedRef = useRef(false);
	const lastAuthErrorRef = useRef(false);
	const clearAuthErrorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);

	useEffect(() => {
		if (!isAuthenticated || !authUser?.id || hasConnectedRef.current) {
			return;
		}

		const connectSocket = async () => {
			try {
				await socketManager.connect(
					SOCKET_ENDPOINT,
					{
						token: tokenManager.getAccessToken() || "",
						userId: String(authUser.id),
					},
					{
						maxReconnectAttempts: 3,
						reconnectDelay: 5000,
						heartbeatInterval: 0,
						heartbeatTimeout: 0,
					},
					async () => {
						const newToken = await tokenManager.refreshToken();
						return newToken;
					},
				);

				hasConnectedRef.current = true;
			} catch (error) {
				console.error("❌ 소켓 연결 실패:", error);
			}
		};

		const handleConnect = (..._args: unknown[]) => {
			setIsConnected(true);
			// 연결되면 인증 에러 플래그 초기화
			lastAuthErrorRef.current = false;
		};

		const handleDisconnect = (...args: unknown[]) => {
			const reason = args[0] as string;
			setIsConnected(false);
			// 다음 연결 시도를 허용하기 위해 가드 리셋
			hasConnectedRef.current = false;

			// 토큰 만료 가능성: 최근 connect_error가 인증 문제였거나 서버가 연결을 끊음
			const maybeAuthExpired =
				lastAuthErrorRef.current || reason === "io server disconnect";

			if (maybeAuthExpired) {
				(async () => {
					try {
						await tokenManager.refreshToken();
					} catch (e) {
						console.error("❌ 토큰 재발급 실패:", e);
						return;
					}
					try {
						// 강제 재연결: 기존 소켓 종료 후 새 연결
						hasConnectedRef.current = false;
						socketManager.disconnect();
						await connectSocket();
					} catch (e) {
						console.error("❌ 토큰 재발급 후 재연결 실패:", e);
					}
				})();
				return;
			}

			// 안전한 재연결: 네트워크/전송 문제일 때만 지연 재연결
			if (reason === "transport close" || reason === "transport error") {
				setTimeout(() => {
					// 재연결 시도 전 상태 재확인
					if (isAuthenticated && authUser?.id && !hasConnectedRef.current) {
						connectSocket().catch((error) => {
							console.error("❌ 재연결 실패:", error);
						});
					} else {
					}
				}, 5000); // 5초로 연장
			}
		};

		// JWT 만료 시 실패한 이벤트 재전송 처리
		const handleJwtExpired = async (...args: unknown[]) => {
			const errorData = args[0] as {
				event: string;
				data: {
					eventName: string;
					eventData: unknown;
				};
				timestamp: string;
			};

			try {
				// 1. 토큰 갱신
				const newToken = await tokenManager.refreshToken();

				if (!newToken) {
					console.error("❌ 토큰 갱신 실패");
					return;
				}

				// 2. 소켓에 새 토큰 업데이트 (서버 명세: connection-update-token)
				const socket = socketManager.socketInstance?.socket;
				if (socket?.connected) {
					socket.emit("connection-update-token", { token: newToken });

					// 토큰 업데이트 후 충분한 대기 시간 확보
					// - 서버가 토큰을 업데이트할 시간
					// - 첫 번째 요청이 완전히 롤백/처리될 시간
					// - DB 트랜잭션이 완료될 시간
					await new Promise((resolve) => setTimeout(resolve, 500));
				}

				// 3. 실패한 이벤트 재전송
				const canRetry =
					socketManager.connected &&
					errorData?.data?.eventName &&
					errorData?.data?.eventData;

				console.log("🔄 재전송 조건 체크:", {
					connected: socketManager.connected,
					hasEventName: !!errorData?.data?.eventName,
					hasEventData: !!errorData?.data?.eventData,
					canRetry,
				});

				if (canRetry) {
					socketManager.send(
						errorData.data.eventName,
						errorData.data.eventData,
					);
				}
			} catch (error) {
				console.error("❌ jwt-expired-error 처리 실패:", error);
			}
		};

		const handleConnectError = (...args: unknown[]) => {
			const error = (args?.[0] as Error) || ({} as Error);
			const msg = (error?.message || "").toLowerCase();
			const isAuthError =
				msg.includes("unauthorized") ||
				msg.includes("401") ||
				msg.includes("jwt");
			if (isAuthError) {
				lastAuthErrorRef.current = true;
				// 일정 시간 후 자동 해제하여 오래된 상태가 남지 않도록 처리
				if (clearAuthErrorTimeoutRef.current) {
					clearTimeout(clearAuthErrorTimeoutRef.current);
				}
				clearAuthErrorTimeoutRef.current = setTimeout(() => {
					lastAuthErrorRef.current = false;
					clearAuthErrorTimeoutRef.current = null;
				}, 15000);
			}
		};

		socketManager.on("connect", handleConnect);
		socketManager.on("disconnect", handleDisconnect);
		socketManager.on("jwt-expired-error", handleJwtExpired);
		socketManager.on("connect_error", handleConnectError);

		connectSocket();

		return () => {
			socketManager.off("connect", handleConnect);
			socketManager.off("disconnect", handleDisconnect);
			socketManager.off("jwt-expired-error", handleJwtExpired);
			socketManager.off("connect_error", handleConnectError);
			if (clearAuthErrorTimeoutRef.current) {
				clearTimeout(clearAuthErrorTimeoutRef.current);
				clearAuthErrorTimeoutRef.current = null;
			}
		};
	}, [isAuthenticated, authUser?.id, SOCKET_ENDPOINT]);

	return (
		<GamegooSocketContext.Provider value={{ isAuthenticated, isConnected }}>
			{children}
		</GamegooSocketContext.Provider>
	);
}

export const useGamegooSocket = () => {
	const context = useContext(GamegooSocketContext);
	if (!context) {
		throw new Error(
			"useGamegooSocket must be used within GamegooSocketProvider",
		);
	}
	return context;
};
