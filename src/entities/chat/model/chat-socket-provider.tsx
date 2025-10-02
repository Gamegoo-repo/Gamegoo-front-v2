import { useChatMessage } from "./use-chat-message";
import { useFriendOnline } from "./use-friend-online";

/**
 * 채팅 관련 소켓 이벤트를 전역에서 처리하는 컴포넌트
 * 앱의 루트 레벨에서 사용하여 채팅방을 열지 않아도 메시지를 수신할 수 있도록 함
 */
function ChatSocketProvider({ children }: { children: React.ReactNode }) {
	useChatMessage();
	useFriendOnline();

	return <>{children}</>;
}

export default ChatSocketProvider;
