import { useChatMessageSocket } from "@/features/chat/api/use-chat-message-socket";
import useChatroomListManager from "@/features/chat/api/use-chatroom-list-manager";
import { useFriendOnline } from "@/features/friend/api/use-friend-online";

function ChatSocketProvider({ children }: { children: React.ReactNode }) {
	useChatroomListManager();
	useChatMessageSocket();
	useFriendOnline();

	return <>{children}</>;
}

export default ChatSocketProvider;
