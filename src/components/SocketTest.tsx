import { useEffect } from "react";
import {
	SocketProvider,
	useSocketConnectionEvents,
	useSocketMessage,
	useSocketStatus,
} from "../shared/socket";

const SocketTestInner = () => {
	const { isConnected, stateLabel, readyState } = useSocketStatus();

	// 연결 관련 이벤트 로깅
	useSocketConnectionEvents({
		onConnect: () => {
			console.log("✅ 소켓 연결됨");
			console.log("📡 연결 시각:", new Date().toLocaleTimeString());
		},
		onDisconnect: (reason) => {
			console.log("❌ 소켓 끊어짐:", reason);
			console.log("💭 끊어짐 사유 상세:", reason);
			console.log("📡 끊어짐 시각:", new Date().toLocaleTimeString());
		},
		onError: (error) => {
			console.error("🔥 소켓 오류:", error);
			console.error("🔥 오류 메시지:", error.message);
			console.error("🔥 오류 스택:", error.stack);
		},
		onReconnect: (attempt) => {
			console.log("🔄 재연결됨 (시도:", attempt, ")");
		},
		onReconnectFailed: () => {
			console.log("💥 재연결 실패 - 최대 시도 횟수 초과");
		},
	});

	// 모든 메시지 수신 로깅 (채팅 메시지 예시)
	useSocketMessage("chat_message", (data) => {
		console.log("📩 채팅 메시지 수신:", data);
	});

	useSocketMessage("notification", (data) => {
		console.log("🔔 알림 수신:", data);
	});

	useSocketMessage("match_found", (data) => {
		console.log("🎮 매치 찾음:", data);
	});

	// 소켓 저수준 이벤트 모니터링
	useSocketMessage("connect_error", (error) => {
		console.error("🚫 연결 오류:", error);
	});

	useSocketMessage("disconnect", (reason) => {
		console.warn("🔌 disconnect 이벤트:", reason);
	});

	// 추가 디버깅 이벤트들
	useSocketMessage("reconnect_attempt", (attemptNumber) => {
		console.log("🔄 재연결 시도 #", attemptNumber);
	});

	useSocketMessage("reconnect_error", (error) => {
		console.error("🔄❌ 재연결 에러:", error);
	});

	// 컴포넌트 마운트 로깅
	useEffect(() => {
		console.log("🔌 소켓 테스트 컴포넌트 마운트됨");
		console.log("🎯 연결 대상:", "https://socket.gamegoo.co.kr");
		console.log("🔑 사용자 ID:", "50");
	}, []);

	return (
		<div className="border p-4 rounded-lg bg-gray-50">
			<h3 className="text-lg font-bold mb-2">🔌 소켓 연결 테스트</h3>
			<div className="space-y-2 text-sm">
				<div>
					<span className="font-medium">연결 상태:</span>
					<span
						className={`ml-2 px-2 py-1 rounded text-xs ${
							isConnected
								? "bg-green-100 text-green-800"
								: "bg-red-100 text-red-800"
						}`}
					>
						{stateLabel}
					</span>
				</div>
				<div>
					<span className="font-medium">Ready State:</span>
					<span className="ml-2">{readyState}</span>
				</div>
				<div>
					<span className="font-medium">연결 여부:</span>
					<span className="ml-2">
						{isConnected ? "✅ 연결됨" : "❌ 연결 안됨"}
					</span>
				</div>
			</div>
			<div className="mt-3 text-xs text-gray-600">
				💡 개발자 콘솔에서 소켓 이벤트를 확인하세요!
			</div>
		</div>
	);
};

const SocketTest = () => {
	const SOCKET_ENDPOINT = "";
	const ACCESS_TOKEN = "";

	return (
		<SocketProvider
			endpoint={SOCKET_ENDPOINT}
			authData={{ token: ACCESS_TOKEN, userId: "50" }}
			options={{
				maxReconnectAttempts: 3,
				reconnectDelay: 5000,
				heartbeatInterval: 0,
				heartbeatTimeout: 0,
			}}
			onSocketOpen={() => console.log("🎉 소켓 연결 성공!")}
			onSocketError={(error) => {
				console.error("💥 소켓 에러:", error);
				console.error("💥 에러 타입:", error.constructor.name);
			}}
			onSocketClose={(reason) => {
				console.log("👋 소켓 연결 종료:", reason);
				console.log("👋 종료 시각:", new Date().toLocaleTimeString());
			}}
		>
			<SocketTestInner />
		</SocketProvider>
	);
};

export default SocketTest;
