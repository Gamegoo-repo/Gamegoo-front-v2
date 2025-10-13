import { useChatDialogStore } from "@/entities/chat";
import { Chatroom, ChatroomList } from "@/features/chat";
import { useFriendOnline } from "@/features/friend";
import FriendList from "@/features/friend/ui/friend-list";

function FloatingChatDialogContent() {
	useFriendOnline();
	const { chatDialogType } = useChatDialogStore();

	if (chatDialogType === "friend-list") {
		return <FriendList />;
	}

	if (chatDialogType === "chatroom-list") {
		return <ChatroomList />;
	}

	if (chatDialogType === "chatroom") {
		return <Chatroom />;
	}

	return null;
}

export default FloatingChatDialogContent;
