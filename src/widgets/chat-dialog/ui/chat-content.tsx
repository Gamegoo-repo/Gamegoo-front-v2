import { useFriendOnline } from "../hooks/use-friend-online";
import FriendLists from "./tab-contents/friend-list";

interface ChatContentProps {
	activeTab: number;
}

function ChatContent({ activeTab }: ChatContentProps) {
	useFriendOnline();

	if (activeTab === 0) {
		return <FriendLists />;
	}

	// TODO: 채팅방 목록 추가
	return null;
}

export default ChatContent;
