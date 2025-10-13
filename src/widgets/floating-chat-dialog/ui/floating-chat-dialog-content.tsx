import { useChatDialogStore } from "@/entities/chat/store/use-chat-dialog-store";
import Chatroom from "@/features/chat/ui/chatroom/chatroom";
import ChatRoomList from "@/features/chat/ui/chatroom-list/chatroom-list";
import { useFriendOnline } from "@/features/friend/api/use-friend-online";
import FriendList from "@/features/friend/ui/friend-list";

function FloatingChatDialogContent() {
	useFriendOnline();
	const { chatDialogType } = useChatDialogStore();

	if (chatDialogType === "friend-list") {
		return <FriendList />;
	}

	if (chatDialogType === "chatroom-list") {
		return <ChatRoomList />;
	}

	if (chatDialogType === "chatroom") {
		return <Chatroom />;
	}

	return null;
}

export default FloatingChatDialogContent;
