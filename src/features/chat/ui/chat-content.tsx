import { useChatDialogStore } from "../model/store";
import { useFriendOnline } from "../model/use-friend-online";
import Chatroom from "./chatroom/chatroom";
import ChatRoomList from "./chatroom-list/chat-room-list";
import FriendList from "./friend-list/friend-list";

function ChatContent() {
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

export default ChatContent;
