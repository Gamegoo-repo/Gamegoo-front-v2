import { useChatStore } from "@/entities/chat";
import useChatroomList from "../../hooks/use-chatroom-list";
import ChatroomItem from "./chatroom-item";

const ChatroomList = () => {
	const { isFetching, error } = useChatroomList();

	const { chatrooms } = useChatStore();

	if (isFetching || error) {
		return null;
	}

	if (chatrooms.length === 0) {
		return (
			<div className="flex items-center justify-center py-8 text-gray-500">
				생성된 채팅방이 없습니다.
			</div>
		);
	}

	return (
		<div>
			{chatrooms.map((room) => (
				<ChatroomItem key={room.uuid} room={room} onChatRoom={() => {}} />
			))}
		</div>
	);
};

export default ChatroomList;
