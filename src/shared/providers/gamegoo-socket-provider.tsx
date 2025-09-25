import { createContext, type ReactNode, useContext } from "react";
import { tokenManager } from "@/shared/api";
import { SocketProvider } from "@/shared/api/socket";

interface GamegooSocketContextType {
	isAuthenticated: boolean;
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

	// 로그인되지 않은 경우 소켓 연결하지 않음
	if (!isAuthenticated) {
		return (
			<GamegooSocketContext.Provider value={{ isAuthenticated: false }}>
				{children}
			</GamegooSocketContext.Provider>
		);
	}

	return (
		<GamegooSocketContext.Provider value={{ isAuthenticated: true }}>
			<SocketProvider
				endpoint={SOCKET_ENDPOINT}
				authData={{ token: accessToken, userId: "8" }}
				options={{
					maxReconnectAttempts: 3,
					reconnectDelay: 5000,
					heartbeatInterval: 0,
					heartbeatTimeout: 0,
				}}
				onSocketOpen={() => console.log("🎉 전역 소켓 연결 성공!")}
				onSocketError={(error: Error) => {
					console.error("💥 전역 소켓 에러:", error);
				}}
				onSocketClose={(reason: string) => {
					console.log("👋 전역 소켓 연결 종료:", reason);
				}}
			>
				{children}
			</SocketProvider>
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
