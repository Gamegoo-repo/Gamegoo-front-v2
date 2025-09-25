import {
	useSocketConnectionEvents,
	useSocketMessage,
	useSocketStatus,
} from "@/shared/api/socket";
import { useGamegooSocket } from "@/shared/providers/gamegoo-socket-provider";

function SocketTestInner() {
	const { isAuthenticated } = useGamegooSocket();
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

	return (
		<div className="border p-4 rounded-lg bg-gray-50">
			<h3 className="text-lg font-bold mb-2">🔌 소켓 연결 테스트</h3>
			<div className="space-y-2 text-sm">
				<div>
					<span className="font-medium">인증 상태:</span>
					<span
						className={`ml-2 px-2 py-1 rounded text-xs ${
							isAuthenticated
								? "bg-blue-100 text-blue-800"
								: "bg-gray-100 text-gray-800"
						}`}
					>
						{isAuthenticated ? "로그인됨" : "로그아웃"}
					</span>
				</div>
				{isAuthenticated && (
					<>
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
					</>
				)}
				{!isAuthenticated && (
					<div className="text-gray-600">
						🔒 로그인하면 소켓이 자동으로 연결됩니다
					</div>
				)}
			</div>
			<div className="mt-3 text-xs text-gray-600">
				💡 개발자 콘솔에서 소켓 이벤트를 확인하세요!
			</div>
		</div>
	);
}

function SocketTest() {
	return <SocketTestInner />;
}

export default SocketTest;
