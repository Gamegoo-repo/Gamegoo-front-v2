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
import { useAuthUser } from "./auth-user-provider";

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
	const accessToken = tokenManager.getAccessToken();
	const isAuthenticated = !!accessToken;
	const SOCKET_ENDPOINT = process.env.PUBLIC_SOCKET_URL!;
	const { authUser } = useAuthUser();
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
				console.log("🚀 소켓 연결 시작");

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
					// tokenProvider: 토큰 만료 시 자동 갱신 및 재연결에 사용
					async () => {
						const newToken = await tokenManager.refreshToken();
						return newToken;
					},
				);

				console.log("✅ 소켓 연결 완료");
				hasConnectedRef.current = true;
			} catch (error) {
				console.error("❌ 소켓 연결 실패:", error);
			}
		};

		const handleConnect = (..._args: unknown[]) => {
			console.log("🟢 소켓 연결됨");
			setIsConnected(true);
			// 연결되면 인증 에러 플래그 초기화
			lastAuthErrorRef.current = false;
		};

		const handleDisconnect = (...args: unknown[]) => {
			const reason = args[0] as string;
			console.log("🔴 소켓 연결 해제:", reason);
			setIsConnected(false);
			// 다음 연결 시도를 허용하기 위해 가드 리셋
			hasConnectedRef.current = false;

			// 토큰 만료 가능성: 최근 connect_error가 인증 문제였거나 서버가 연결을 끊음
			const maybeAuthExpired =
				lastAuthErrorRef.current || reason === "io server disconnect";

			if (maybeAuthExpired) {
				(async () => {
					console.log("⏳ 토큰 만료 의심 - 토큰 재발급 및 재연결 시도");
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
				console.log("🔄 소켓 재연결 준비 중... (5초 후)");
				setTimeout(() => {
					// 재연결 시도 전 상태 재확인
					if (isAuthenticated && authUser?.id && !hasConnectedRef.current) {
						console.log("🔄 안전한 소켓 재연결 시도...");
						connectSocket().catch((error) => {
							console.error("❌ 재연결 실패:", error);
						});
					} else {
						console.log("⚠️ 재연결 조건 불충족 - 재연결 취소");
					}
				}, 5000); // 5초로 연장
			}
		};

		const handleJwtExpired = async (...args: unknown[]) => {
			console.log("⏳ JWT 만료 이벤트 수신 - 토큰 재발급 및 재연결 진행", args);
			try {
				await tokenManager.refreshToken();
			} catch (e) {
				console.error("❌ 토큰 재발급 실패:", e);
				return;
			}
			try {
				// 강제 재연결
				hasConnectedRef.current = false;
				socketManager.disconnect();
				await connectSocket();
			} catch (e) {
				console.error("❌ 토큰 재발급 후 재연결 실패:", e);
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
	}, [isAuthenticated, authUser?.id, accessToken, SOCKET_ENDPOINT]);

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
