import { useChatMessageSocket, useChatroomListManager } from "@/features/chat";
import { useFriendOnline } from "@/features/friend";

function ChatSocketProvider({ children }: { children: React.ReactNode }) {
	useChatroomListManager();
	useChatMessageSocket();
	useFriendOnline();

	return <>{children}</>;
}

export default ChatSocketProvider;
