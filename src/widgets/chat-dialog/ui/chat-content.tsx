import { useFriendOnline } from "../hooks/use-friend-online";
import { ChatroomList, FriendList } from "./tab-contents";

interface ChatContentProps {
	activeTab: number;
}

function ChatContent({ activeTab }: ChatContentProps) {
	useFriendOnline();

	if (activeTab === 0) {
		return <FriendList />;
	}

	if (activeTab === 1) {
		return <ChatroomList />;
	}

	return null;
}

export default ChatContent;
