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
						token: accessToken,
						userId: String(authUser.id),
					},
					{
						maxReconnectAttempts: 3,
						reconnectDelay: 5000,
						heartbeatInterval: 0,
						heartbeatTimeout: 0,
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
		};

		const handleDisconnect = (...args: unknown[]) => {
			const reason = args[0] as string;
			console.log("🔴 소켓 연결 해제:", reason);
			setIsConnected(false);
			
			// 안전한 재연결: 무한 재연결 방지
			if (reason === "transport close" || reason === "transport error") {
				console.log("🔄 소켓 재연결 준비 중... (5초 후)");
				setTimeout(() => {
					// 재연결 시도 전 상태 재확인
					if (isAuthenticated && authUser?.id && !hasConnectedRef.current) {
						console.log("🔄 안전한 소켓 재연결 시도...");
						connectSocket().catch(error => {
							console.error("❌ 재연결 실패:", error);
						});
					} else {
						console.log("⚠️ 재연결 조건 불충족 - 재연결 취소");
					}
				}, 5000); // 5초로 연장
			}
		};

		socketManager.on("connect", handleConnect);
		socketManager.on("disconnect", handleDisconnect);

		connectSocket();

		return () => {
			socketManager.off("connect", handleConnect);
			socketManager.off("disconnect", handleDisconnect);
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
